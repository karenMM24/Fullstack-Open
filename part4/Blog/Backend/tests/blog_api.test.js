const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))
  await Blog.insertMany(blogsWithUser)

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })

  token = response.body.token
})

test('all blogs returned in JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)


  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})



test('the unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]

  assert.strictEqual('id' in firstBlog, true)
})

test('a new blog can be added', async () => {
  const newBlog = {
    title: 'New test blog',
    author: 'Someone',
    url: 'someUrlDirection.com',
    likes: 100,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('New test blog'))
})

test('if likes property is missing', async () => {
  const newBlog = {
    title: 'New test blog',
    author: 'Someone',
    url: 'someUrlDirection.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helper.blogsInDb()
  const blogToCheck = blogsAfter[3]

  assert.strictEqual(blogToCheck.likes, 0)
})

test('if url or title missing responde with 400', async () => {
  const noTitle = {
    author: 'Someone',
    url: 'someUrl',
    likes: 0
  }

  const noUrl = {
    title: 'title',
    author: 'Someone',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(noUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('delete success status 204 if id valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogAtEnd = await helper.blogsInDb()

  const ids = blogAtEnd.map(n => n.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog can update likes', async () => {
  const blog = await helper.blogsInDb()
  const blogToUpdate = blog[0]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ ...blogToUpdate, likes: 10 })
    .expect(200)

  const blogsAfter = await helper.blogsInDb()
  const blogUpdated = blogsAfter[0]
  assert.strictEqual(blogUpdated.likes, 10)

})

test('if token not provided it responds with 401', async () => {

  const newBlog = {
    title: 'title',
    author: 'Someone',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
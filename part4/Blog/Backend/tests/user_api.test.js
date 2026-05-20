const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username:'newUsername',
      name:'someName',
      password:'aPassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, usersAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status and meesage', async () => {
    const usersAtStart = await helper.usersInDb()

    const userNoUnique = { username: 'root', name: 'notUnique', password: 'somethinng' }
    const userUnvalidPw = { username: 'somethingUnique', name: 'soneName', password:'12' }

    const userResult = await api
      .post('/api/users')
      .send(userNoUnique)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const passwordResult = await api
      .post('/api/users')
      .send(userUnvalidPw)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(userResult.body.error.includes('expected `username` to be unique'))
    assert(passwordResult.body.error.includes('password must be at least 3 characters long'))

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)

  })
})

after(async () => {
  await mongoose.connection.close()
})
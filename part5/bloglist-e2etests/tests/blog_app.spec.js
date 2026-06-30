const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    
    await request.post('/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' }
    })
    await request.post('/api/users', {
      data: { name: 'Test user', username: 'test', password: '12345' }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    
    await expect(page.getByRole('heading', { name: 'log into application' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'log out' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'log out' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'log out' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('link', { name: 'new blog' }).click()
      
      await page.getByTestId('title').fill('some test title')
      await page.getByTestId('author').fill('author name')
      await page.getByTestId('url').fill('url.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('a new blog some test title by author name have been added')).toBeVisible()
      
      await page.getByRole('link', { name: 'blogs' }).click()
      
      await expect(page.getByRole('link', { name: 'some test title by author name' })).toBeVisible()
    })

    describe('and blogs exists', () => {
      beforeEach(async ({ page }) => {
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('loggedBlogappUser')).token)
        
        await page.request.post('/api/blogs', {
          data: { title: 'title1', author: 'author1', url: 'url1', likes: 1 },
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await page.request.post('/api/blogs', {
          data: { title: 'title2', author: 'author2', url: 'url2', likes: 2 },
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await page.request.post('/api/blogs', {
          data: { title: 'title3', author: 'author3', url: 'url3', likes: 3 },
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        await page.goto('/') 
      })

      test('A blog can be edited (likes)', async ({ page }) => {
        await page.getByRole('link', { name: 'title1 by author1' }).click()
        
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('A blog can be eliminated by the user that created it', async ({ page }) => {
        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        
        await page.getByRole('link', { name: 'title1 by author1' }).click()
        
        await page.getByRole('button', { name: 'remove' }).click()
        
        await page.getByRole('link', { name: 'blogs' }).click()
        await expect(page.getByRole('link', { name: 'title1 by author1' })).not.toBeVisible()
      })

      test('Button delete only visible for the user that created it', async ({ page }) => {
        await page.getByRole('button', { name: 'log out' }).click()
        
        await page.getByRole('link', { name: 'login' }).click()
        await loginWith(page, 'test', '12345')
        
        await page.getByRole('link', { name: 'blogs' }).click()
        
        await page.getByRole('link', { name: 'title1 by author1' }).click()
        
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('Blogs in orden of likes', async ({ page }) => {
        const listItems = page.locator('li')
        
        await expect(listItems.nth(0)).toContainText('title3 by author3') 
        await expect(listItems.nth(1)).toContainText('title2 by author2') 
        await expect(listItems.nth(2)).toContainText('title1 by author1') 
      })
    })
  })
})
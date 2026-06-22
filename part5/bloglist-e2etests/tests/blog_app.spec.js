const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('/api/users', {
          data: {
            name: 'Test user',
            username: 'test',
            password: '12345'
          }
        })

    await page.goto('/')

  })

  test('Login form is shown', async ({ page }) => {
    // ...
    const locator = page.getByText('log into application')
    await expect(locator).toBeVisible()
    await expect(page.getByRole('button', {name:'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in'))
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('Wrong username or password')).toBeVisible()

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
      loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      // ...
      await page.getByRole('button', {name:'create new blog'}).click()
      await page.getByTestId('title').fill('some test title')
      await page.getByTestId('author').fill('author name')
      await page.getByTestId('url').fill('url.com')
      await page.getByRole('button', {name:'create'}).click()

      await expect(page.getByText('a new blog some test title by author name have been added')).toBeVisible()
      await expect(page.getByText('some test title - author name')).toBeVisible()
    })

    describe('and blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'title1', 'author1', 'url1')
        await createBlog(page, 'title2', 'author2', 'url2')
        await createBlog(page, 'title3', 'author3', 'url3')
      })

      test('A blog can be edited (likes)', async({ page }) => {
        await page.getByRole('button', { name: 'show' }).first().click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('A blog can be eliminated by the user that craeted it', async({ page }) => {
        await page.getByRole('button', { name: 'show' }).first().click();
        page.on('dialog', async dialog => {
          console.log(dialog.message()); 
          await dialog.accept();        
        });
        await page.getByRole('button', { name: 'remove' }).click();
        await expect(page.getByText('title1 - author1')).not.toBeVisible()
      })

      test('Button delete only visible for the user that created it', async({ page }) => {
        await page.getByRole('button', {name:'log out'}).click()
        loginWith(page,'test','12345')
        await page.getByRole('button', { name: 'show' }).first().click();
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('Blogs in orden of likes', async({page}) => {
        const blog1 = page.locator('.blog').filter({ hasText: 'title1 - author1' })
        const blog2 = page.locator('.blog').filter({ hasText: 'title2 - author2' })
        const blog3 = page.locator('.blog').filter({ hasText: 'title3 - author3' })

        await blog1.getByRole('button', { name: 'show' }).click()
        await blog2.getByRole('button', { name: 'show' }).click()
        await blog3.getByRole('button', { name: 'show' }).click()

        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3).toContainText('likes 1')
        
        await blog3.getByRole('button', { name: 'like' }).click()
        await expect(blog3).toContainText('likes 2')

        await blog2.getByRole('button', { name: 'like' }).click()
        await expect(blog2).toContainText('likes 1')

        const allBlogs = page.locator('.blog')
        await expect(allBlogs.nth(0)).toContainText('title3 - author3') 
        await expect(allBlogs.nth(1)).toContainText('title2 - author2') 
        await expect(allBlogs.nth(2)).toContainText('title1 - author1')
      })
    })
  })

})
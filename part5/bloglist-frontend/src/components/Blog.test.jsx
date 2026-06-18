import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'

test('renders only title and author by default', () => {
  const blog = {
    title : 'test blog',
    author: 'author test',
    url: 'test.com',
    likes : 3,
    user : "userTest"
  }

  render(<Blog blog={blog}/>)

  const title = screen.getByText('test blog', { exact: false })
  const author = screen.getByText('author test', { exact: false })

  expect(title).toBeDefined()
  expect(author).toBeDefined()

  const url = screen.queryByText("test.com", { exact: false })
  const likes = screen.queryByText(3, { exact: false })

  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('clicking show renders url and likes', async () => {
  const blog = {
    title : 'test blog',
    author: 'author test',
    url: 'test.com',
    likes : 3,
    user : "userTest"
  }

  const user = {
    username:'username'
  }

  render(<Blog blog={blog} user={user}/>)

  const mockHandler = vi.fn()
  const appUser = userEvent.setup()

  const button = screen.getByText('show')
  await appUser.click(button)

  expect(screen.getByText('test.com')).toBeDefined()
  expect(screen.getByText(3, { exact:false})).toBeDefined()
})

test('Clicking on like botton calls the correct times', async () => {
  const blog = {
    title : 'test blog',
    author: 'author test',
    url: 'test.com',
    likes : 3,
    user : "userTest"
  }

  const user = {
    username:'username'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} addLike={mockHandler}/>)

  const appUser = userEvent.setup()

  const button = screen.getByText('show')
  await appUser.click(button)

  const likeButton = screen.getByText('like')
  await appUser.click(likeButton)
  await appUser.click(likeButton)
  screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(2)
})
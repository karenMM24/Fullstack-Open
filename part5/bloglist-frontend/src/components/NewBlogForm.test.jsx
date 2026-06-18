import { render, screen } from '@testing-library/react'
import { NewBlogForm } from './NewBlogForm'
import userEvent from '@testing-library/user-event'

test('Form calls the handler with the correct info', async () => {
  
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<NewBlogForm createBlog={mockHandler}/>)

  const titleInput = screen.getByPlaceholderText('write the title')
  const authorInput = screen. getByPlaceholderText('write the author')
  const urlInput = screen.getByPlaceholderText('write the url')
  const button = screen.getByText('create')

  await user.type(titleInput, 'test')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'test.com')
  await user.click(button)

  screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(1)

  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: 'test',
    author: 'author',
    url: 'test.com'
  })
})
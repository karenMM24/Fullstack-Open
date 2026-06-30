import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

const blog = {
  title: 'test blog',
  author: 'author test',
  url: 'test.com',
  likes: 3,
  user: {
    name: 'Creator Name',
    username: 'creatorUser'
  }
}

test('Blog information and likes are displayed to unauthenticated users, buttons are not', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText('author test : test blog')).toBeDefined()
  expect(screen.getByText('test.com')).toBeDefined()
  expect(screen.getByText('likes 3', { exact: false })).toBeDefined()
  expect(screen.getByText('Added by Creator Name')).toBeDefined()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('Authenticated users who are not the creator are shown only the like button', () => {
  const nonCreatorUser = { username: 'otherUser' }
  
  render(<Blog blog={blog} user={nonCreatorUser} />)

  expect(screen.getByText('like')).toBeDefined()
  
  expect(screen.queryByText('remove')).toBeNull()
})

test('The blogs creator is also shown the delete button', () => {
  const creatorUser = { username: 'creatorUser' }
  
  render(<Blog blog={blog} user={creatorUser} />)

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('remove')).toBeDefined()
})
import { useState } from 'react'

export const NewBlogForm = ({createBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const handleCreateBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return(
    <form onSubmit={ handleCreateBlog }>
      <h2>create new</h2>
      <div>
        <label>
          title:
          <input
            data-testid='title'
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write the title '
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            data-testid='author'
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write the author'
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            data-testid='url'
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write the url'
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}
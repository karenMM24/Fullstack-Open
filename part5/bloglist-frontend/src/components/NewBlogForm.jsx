import { useState } from 'react'
import { TextField, Button } from '@mui/material'

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
          <TextField
          required  
          fullWidth
          margin='dense'
            label="title"
            type='text'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write the title '
            slotProps={{
              htmlInput: {
                'data-testid':'title'
              }
            }}
          />
      </div>
      <div>
          <TextField
          required
          fullWidth
          margin='dense'
          label="author"
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write the author'
            slotProps={{
              htmlInput: {
                'data-testid':'author'
              }
            }}
          />
      </div>
      <div>
          <TextField
          fullWidth
          required
          margin='dense'
          label="url"
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write the url'
            slotProps={{
              htmlInput: {
                'data-testid':'url'
              }
            }}
          />
      </div>
      <Button type="submit" variant='contained'>create</Button>
    </form>
  )
}
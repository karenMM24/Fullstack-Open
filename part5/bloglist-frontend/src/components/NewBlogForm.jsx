import { useState } from "react"
import blogService from '../services/blogs'

export const NewBlogForm = ({ blogs, setBlogs, setNotification, user }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")


  const createBlog = async event => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url,
    }

    try{
      const returnedBlog = await blogService.create(newBlog)
      setAuthor("")
      setTitle("")
      setUrl("")

      setNotification({message:`a new blog ${returnedBlog.title} by ${returnedBlog.author} have been added`, isError:false})
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))

    } catch{
      console.log('error durinf post')
    }
  }

  return(
    <form onSubmit={ createBlog }>
      <h2>create new</h2>
      <div>
        <label>
          title:
          <input 
          type='text'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type='text'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type='text'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}
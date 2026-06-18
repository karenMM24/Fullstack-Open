import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, user }) => {
  const [show, setShow] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showInfo = () => {
    if(show){
      setShow(false)
    } else{
      setShow(true)
    }
  }

  const addLike = async () => {
    const updateBlog = {
      title:blog.title,
      author:blog.author,
      url:blog.url,
      likes:blog.likes + 1,
      user:blog.user.id
    }
    console.log('user', blog.user)
    console.log('blog tryng to upd', blog)
    console.log('updated Blog', updateBlog)
    try{
      console.log('enter try')
      const updatedBlog = await blogService.update(blog.id, updateBlog)
      console.log('reach update')
      const blogListUpdated = blogs.map((b) => {
        if(b.id === updatedBlog.id){
          return updatedBlog
        } else{
          return b
        }
      })

      setBlogs(blogListUpdated)

    } catch (error){
      console.log('oh oh, smt went wrong')
      console.error(error)
    }
  }

  const deleteBlog = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }catch(error){
        console.log('oh oh, smt went wrong')
        console.error(error)
      }
    }
  }


  const blogInfo = () => (
    <div>
      <p>{blog.url}</p>
      <div>likes {blog.likes} <button onClick={addLike}>like</button></div>
      <p>{blog.user.name}</p>
      {(blog.user.username === user.username) && <button onClick={deleteBlog}>remove</button>}
    </div>
  )

  return (

    <div style={blogStyle}>
      <div>
        {blog.title} - {blog.author}
        <button onClick={showInfo}>{show ? 'hide' : 'show'}</button>
      </div>
      {show && blogInfo()}
    </div>
  )}

export default Blog
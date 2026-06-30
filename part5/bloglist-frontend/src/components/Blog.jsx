import { useState } from 'react'

const Blog = ({ blog, user, addLike, deleteBlog }) => {
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


  const blogInfo = () => (
    <div>
      <p>{blog.url}</p>
      <div>likes {blog.likes} <button onClick={() => addLike(blog)}>like</button></div>
      <p>{blog.user.name}</p>
      {user && blog.user.username === user.username && (
        <button onClick={() => deleteBlog(blog)}>remove</button>
      )}
    </div>
  )

  return (

    <div style={blogStyle} className="blog">
      <div>
        {blog.title} - {blog.author}
        <button onClick={showInfo}>{show ? 'hide' : 'show'}</button>
      </div>
      {show && blogInfo()}
    </div>
  )}

export default Blog
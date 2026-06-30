import { useState } from 'react'

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const [show, setShow] = useState(false)


  return (
    <div>
      <h2>{blog.author} : {blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>likes {blog.likes} {user && (<button onClick={() => addLike(blog)}>like</button>)}</div>
      <p>Added by {blog.user.name}</p>
      {user && blog.user.username === user.username && (
        <button onClick={() => deleteBlog(blog)}>remove</button>
      )}
    </div>
  )}

export default Blog
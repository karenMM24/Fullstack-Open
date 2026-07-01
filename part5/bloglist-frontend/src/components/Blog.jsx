import { useState } from 'react'
import { Paper, Button } from '@mui/material' 

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const [show, setShow] = useState(false)


  return (
    <div>
      <Paper elevation={4} square={false} 
        sx={{
          borderRadius: 3,
          padding: 1,
          margin: 3,
          fontFamily: 'Arial'
          }}>
      <h2>{blog.title}</h2>
      <h3 style={{color:'gray'}}>by {blog.author}</h3>
      <a href={blog.url}>{blog.url}</a>
      <p style={{color:'gray'}}>Added by {blog.user.name}</p>
      <div>likes {blog.likes} {user && (<Button variant="outlined" onClick={() => addLike(blog)}>like</Button>)}</div>
      {user && blog.user.username === user.username && (
        <Button variant="outlined" color="error" onClick={() => deleteBlog(blog)} sx={{margin:2}}>remove</Button>
      )}
      </Paper>
    </div>
  )}

export default Blog
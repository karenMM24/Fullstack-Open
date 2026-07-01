import Blog from './Blog'
import Togglable from './Togglable'
import { NewBlogForm } from './NewBlogForm'
import { Notification } from './Notification'
import { Link } from 'react-router-dom'
import {List, ListItem, ListItemText, Button} from '@mui/material'


const BlogList = ({notification, user, createBlog, blogs, addLike, deleteBlog}) => {

  const style = {
  p: 0,
  width: '100%',
  maxWidth: 360,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  margin:2
};

  return(
    <div style={{fontFamily:'Arial'}}>
          <h1>Blogs</h1>
          <Notification notification={notification}/>
          {user && (
            <div>
              <p className='logged-user'>{user.name} is logged in </p>
            </div>)}

          

          <List sx={style}>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>(
              <ListItem key={blog.id}>
                <Button color='inherit' component={Link} to={`/blogs/${blog.id}`} sx={{fontWeight:'bold'}}>{blog.title} by {blog.author}</Button>
              </ListItem>
            ))}
          </List>
        </div>
  )
}

export default BlogList
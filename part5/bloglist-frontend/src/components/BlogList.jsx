import Blog from './Blog'
import Togglable from './Togglable'
import { NewBlogForm } from './NewBlogForm'
import { Notification } from './Notification'
import { Link } from 'react-router-dom'


const BlogList = ({notification, user, createBlog, blogs, addLike, deleteBlog}) => {
  return(
    <div>
          <h2>Blogs</h2>
          <Notification notification={notification}/>
          {user && (
            <div>
              <p className='logged-user'>{user.name} is logged in </p>
            </div>)}

          

          <ul>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>(
              <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}> 
                  {blog.title} by {blog.author}
                </Link>
              </li>
            ))}
          </ul>
        </div>
  )
}

export default BlogList
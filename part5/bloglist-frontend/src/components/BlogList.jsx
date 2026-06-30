import Blog from './Blog'
import Togglable from './Togglable'
import { NewBlogForm } from './NewBlogForm'
import { Notification } from './Notification'

const BlogList = ({notification, user, createBlog, blogs, addLike, deleteBlog}) => {
  return(
    <div>
          <h2>Blogs</h2>
          <Notification notification={notification}/>
          {user && (
            <div>
              <p className='logged-user'>{user.name} is logged in </p>
              <Togglable buttonLabel="create new blog">
                <NewBlogForm createBlog={createBlog} />
              </Togglable>
            </div>)}

          

          <div>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog}/>
            )}
          </div>
        </div>
  )
}

export default BlogList
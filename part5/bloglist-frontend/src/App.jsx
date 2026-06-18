import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { NewBlogForm } from './components/NewBlogForm'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(`local storage ${window.localStorage.getItem('loggedBlogappUser')}`)
      blogService.setToken(user.token)
      setUser(user)
      console.log(`user set ${user}`)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message:'Wrong username or password', isError:true })
      setTimeout(() => {
        setNotification(null)
      },5000)
      console.log('error loginin')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log into application</h1>
      <Notification notification={notification}/>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addLike = async (blog) => {
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

    const deleteBlog = async (blog) => {
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

  const createBlog = async (newBlog) => {
    
    try{
      const returnedBlog = await blogService.create(newBlog)
      
      setNotification({ message:`a new blog ${returnedBlog.title} by ${returnedBlog.author} have been added`, isError:false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))

    } catch{
      console.log('error durinf post')
    }
  }

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>Blogs</h2>
          <Notification notification={notification}/>
          <p className='logged-user'>{user.name} is logged in </p>
          <button className='logOut-btn' onClick={logOut}>log out</button>

          <Togglable buttonLabel="create new blog">
            <NewBlogForm createBlog={createBlog} />
          </Togglable>

          <div>
            {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
              <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog}/>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default App
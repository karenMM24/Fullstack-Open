import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { NewBlogForm } from './components/NewBlogForm'
import { Notification } from './components/Notification'
import Togglable from './components/Togglable'

import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

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

      navigate('/')
      
    } catch {
      setNotification({ message:'Wrong username or password', isError:true })
      setTimeout(() => {
        setNotification(null)
      },5000)
      console.log('error loginin')
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
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
        navigate('/')
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
      navigate('/')
      setNotification({ message:`a new blog ${returnedBlog.title} by ${returnedBlog.author} have been added`, isError:false })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))

      

    } catch{
      console.log('error durinf post')
    }
  }

  const padding = {
    padding: 5
  }

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && (<Link style={padding} to='/create'>new blog</Link>)}
        {!user &&(
          <Link style={padding} to="/login">login</Link>
        )}
        {user && (<button className='logOut-btn' onClick={logOut}>log out</button>)}
        
      </div>

      <Routes>
        <Route path='/login' element={
          <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} notification={notification}/>
        }/>
        <Route path='/' element={
          <BlogList notification={notification} user={user} createBlog={createBlog} blogs={blogs} addLike={addLike} deleteBlog={deleteBlog}/>
        }/>
        <Route path='/blogs/:id' element={
          <Blog blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog}/>
        }/>
        <Route path='/create' element={
          <NewBlogForm createBlog={createBlog}/>
        }
        />
      </Routes>
    </div>
  )
}

export default App
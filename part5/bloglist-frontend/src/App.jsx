import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import { NewBlogForm } from './components/NewBlogForm'
import { Notification } from './components/Notification'

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
      const user = await loginService.login({ username, password})
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
      setNotification({message:"Wrong username or password", isError:true})
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
    setUsername("")
    setPassword("")
  }


  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h2>Blogs</h2>
          <Notification notification={notification}/>
          <p>{user.name} is logged in </p>
          <button onClick={logOut}>log out</button>

          <NewBlogForm blogs={blogs} setBlogs={setBlogs} setNotification={setNotification}/>

          <ul>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </ul>
        </div>
      )}
      

    </div>
  )
}

export default App
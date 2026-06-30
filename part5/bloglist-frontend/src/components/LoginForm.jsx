import { Notification } from "./Notification"

const LoginForm = ({handleLogin, username, setUsername, password, setPassword, notification}) => {
  return(
    <form onSubmit={handleLogin}>
          <h1>log into application</h1>
          <Notification notification={notification}/>
          <div>
            <label>
              username
              <input
                data-testid='username'
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
                data-testid='password'
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
  )
}

export default LoginForm
import { Notification } from "./Notification"
import { TextField, Button } from "@mui/material"

const LoginForm = ({handleLogin, username, setUsername, password, setPassword, notification}) => {

  return(
    <form onSubmit={handleLogin}>
          <h1>log into application</h1>
          <Notification notification={notification}/>
          <div>
            <TextField
                required
                size="small"
                label="username"
                value={username}
                variant="standard"
                margin="dense"
                onChange={({ target }) => setUsername(target.value)}
                slotProps={{
                  htmlInput: {
                    'data-testid': 'username',
                  },
                }}
              />
          </div>
          <div>
            <TextField
              required
              margin="dense"
              type="password"
              size="small"
              variant="standard"
              label="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              slotProps={{
                htmlInput: {
                  'data-testid': 'username',
                },
              }}
            />
          </div>
          <Button type="submit" variant="contained">login</Button>
        </form>
  )
}

export default LoginForm
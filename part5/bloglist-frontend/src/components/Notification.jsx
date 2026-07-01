import { Alert } from '@mui/material'

export const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  const severityType = notification.isError ? 'error' : 'success'

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={severityType}>
      {notification.message}
    </Alert>
  )
}
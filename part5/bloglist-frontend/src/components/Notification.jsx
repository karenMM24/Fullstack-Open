
export const Notification = ({notification}) => {
  if(notification === null){
    return
  }
  return(
    <p className={`notification ${notification.isError ? "error" : ""}`}>
      {notification.message}</p>
  )
}
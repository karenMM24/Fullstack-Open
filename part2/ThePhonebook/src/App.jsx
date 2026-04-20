import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phones'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    phoneService
    .getAll()
    .then(phoneData => {
      setPersons(phoneData)
    })
  }, [])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState({status: false, filter: ''})
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const handleDelete = (id) => {
      const person = persons.find(n => n.id === id)
      if(window.confirm(`Delete ${person.name} ?`)){
        phoneService
          .erase(id)
          .then(setPersons(persons.filter(person => person.id !== id)))
      } 
    }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification}/>
      <Error message = {error}/>
      <Filter setFilter={setFilter}/>
      
      <h3>add new</h3>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName}
      newPhone={newPhone} setNewPhone={setNewPhone} setNotification={setNotification} setError={setError}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} eliminate={handleDelete}/>
    </div>
  )
}

export default App
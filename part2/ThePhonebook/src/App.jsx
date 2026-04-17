import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phones'

const Filter = ({setFilter}) => {

  const filterChange = (event) => {
    const value = event.target.value
    if(value.length > 0){
      const addFilter = {status:true, filter:value}
      setFilter(addFilter)
      console.log(event.target.value)
      return
    }
    setFilter(false, '')
  }
  return(
    <div>
      filter shown with <input onChange={filterChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  const persons = props.persons
  const setPersons = props.setPersons
  const newName = props.newName
  const setNewName = props.setNewName
  const newPhone = props.newPhone
  const setNewPhone = props.setNewPhone

  const addName = (event) => {
    event.preventDefault()
    const added = {name: newName, number: newPhone}
    const inPhonebook = persons.some(person => person.name === added.name)
    if(!inPhonebook){
      phoneService
        .create(added)
        .then(returnedPhone => {
          setPersons(persons.concat(returnedPhone))
          setNewName('')
          setNewPhone('')
        })
      return
    } else{
      const person = persons.find(n => n.name === added.name)
      const changedPerson = {...person, number: newPhone}
      if(window.confirm(`${added.name} is already added to the phonebokk, replace the old number with a new one?`)){
        phoneService
        .update(changedPerson.id, changedPerson)
        .then(returnedPhone => {
          setPersons(persons.map(person => person.id === changedPerson.id ? returnedPhone : person))
        }
        )
      }
      setNewName('')
      setNewPhone('')
    }
  }

  const nameChange = (event) => {
    setNewName(event.target.value)
  }

  const phoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  return(
    <div>
      <form onSubmit={addName}>
        <div>
          name: <input onChange={nameChange} value={newName}/>
        </div>
        <div>
          number: <input onChange={phoneChange} value={newPhone}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({persons, filter, eliminate}) => {


  const personsToShow = filter.status
    ? persons.filter(person => person.name.toLowerCase().includes(filter.filter.toLowerCase()))
    : persons

  return(
    <div>
      {personsToShow.map(person =>
          <li key={person.id}>{person.name} {person.number} <button onClick={() => eliminate(person.id)}>delete</button></li>
        )}
    </div>
  )
}

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
      <Filter setFilter={setFilter}/>
      
      <h3>add new</h3>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName}
      newPhone={newPhone} setNewPhone={setNewPhone} 
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} eliminate={handleDelete}/>
    </div>
  )
}

export default App
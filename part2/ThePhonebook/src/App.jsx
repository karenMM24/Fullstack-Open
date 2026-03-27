import { useState } from 'react'

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
      setPersons(persons.concat(added))
      setNewName('')
      setNewPhone('')
      return
    }
    alert(newName + ' is already added to phonebook')
    setNewName('')
    setNewPhone('')
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

const Persons = ({persons, filter}) => {
  const personsToShow = filter.status
    ? persons.filter(person => person.name.toLowerCase().includes(filter.filter.toLowerCase()))
    : persons

  return(
    <div>
      {personsToShow.map(person =>
          <li key={person.name}>{person.name} {person.number}</li>
        )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState({status: false, filter: ''})


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setFilter={setFilter}/>
      
      <h3>add new</h3>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName}
      newPhone={newPhone} setNewPhone={setNewPhone}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App
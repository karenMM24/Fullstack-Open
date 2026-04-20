import phoneService from '../services/phones'

const PersonForm = (props) => {
    const persons = props.persons
    const setPersons = props.setPersons
    const newName = props.newName
    const setNewName = props.setNewName
    const newPhone = props.newPhone
    const setNewPhone = props.setNewPhone
    const setNotification = props.setNotification
    const setError = props.setError

    const addName = (event) => {
        let noteError = false
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
            setNotification(
                `Added ${added.name}`
            )
            setTimeout(() => {
                setNotification(null)
            }, 5000)
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
            setNotification(
                `${changedPerson.name} number have been changed`
            )
            setTimeout(() => {
                setNotification(null)
            }, 5000)
            })
            .catch(error => {
                noteError = true
                setError(
                    `Information from ${changedPerson.name} has already been removed from the server`
                )
                setTimeout(() => {
                    setError(null)
                }, 5000)
                
            })
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

export default PersonForm
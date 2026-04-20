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

export default Persons
import {useEffect, useState} from 'react'
import axios from "axios";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newPerson, setNewPerson] = useState({name: "", number: ""})
    const [filter, setFilter] = useState("")

    useEffect(() => {
        axios
            .get("http://localhost:3001/persons")
            .then(response => setPersons(response.data))
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        const person = {
            name: newPerson.name,
            number: newPerson.number,
            id: persons.length + 1
        }

        setNewPerson({name: "", number: ""})

        if (persons.some(p => p.name === person.name)) {
            window.alert(`${person.name} is already in the phonebook`)
        } else {
            setPersons(persons.concat(person))
        }

    }

    const handleChange = (event, field) => {
        setNewPerson({
            ...newPerson,
            [field]: event.target.value
        })
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filter={filter} handleFilter={event => setFilter(event.target.value)}/>
            <h3>Add a new person</h3>
            <PersonForm person={newPerson} handleSubmit={handleSubmit} handleChange={handleChange}/>
            <h3>Persons</h3>
            <Persons persons={personsToShow}/>
        </div>
    )
}

const Filter = ({filter, handleFilter}) => {
    return (
        <div>
            filter:
            <input
                value={filter}
                onChange={handleFilter}
            />
        </div>
    )
}

const PersonForm = ({person, handleSubmit, handleChange}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                name:
                <input
                    value={person.name}
                    onChange={event => handleChange(event, "name")}
                />
            </div>
            <div>
                number:
                <input
                    value={person.number}
                    onChange={event => handleChange(event, "number")}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({persons}) => {
    return (
        <table>
            <tbody>
            {persons.map(person =>
                <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{person.number}</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}

export default App
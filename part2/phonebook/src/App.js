import {useEffect, useState} from 'react'
import personService from "./services/persons"

const App = () => {
    const [persons, setPersons] = useState([])
    const [newPerson, setNewPerson] = useState({name: "", number: ""})
    const [filter, setFilter] = useState("")

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const handleSubmit = event => {
        event.preventDefault()
        const personObject = {
            name: newPerson.name,
            number: newPerson.number,
        }

        const existingPerson = persons.find(p => p.name === personObject.name)
        if (existingPerson === undefined) {
            personDoesNotExist(personObject)
        } else {
            personExists(existingPerson.id, personObject)
        }
    }

    const personExists = (id, person) => {
        if (window.confirm(
            `${person.name} is already in the phonebook, replace the old number with a new one?`
        )) {
            personService
                .updatePerson(id, person)
                .then(responsePerson => {
                    setPersons(persons.map(p => p.id !== id ? p : responsePerson))
                })
        }
        setNewPerson({name: "", number: ""})
    }

    const personDoesNotExist = (person) => {
        personService
            .addPerson(person)
            .then(responsePerson => {
                setPersons(persons.concat(responsePerson))
                setNewPerson({name: "", number: ""})
            })
    }

    const handleChange = (event, field) => {
        setNewPerson({
            ...newPerson,
            [field]: event.target.value
        })
    }

    const handleDelete = person => {
        window.confirm(`Delete ${person.name}?`)

        personService
            .deletePerson(person.id)
            .then(() => {
                setPersons(persons.filter(p => p.id !== person.id))
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
            <Persons persons={personsToShow} handleDelete={handleDelete}/>
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

const Persons = ({persons, handleDelete}) => {
    return (
        <table>
            <tbody>
            {persons.map(person =>
                <tr key={person.id}>
                    <td>{person.name}</td>
                    <td>{person.number}</td>
                    <td>
                        <button onClick={() => handleDelete(person)}>delete</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    )
}

export default App
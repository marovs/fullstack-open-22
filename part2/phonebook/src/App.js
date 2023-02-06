import {useEffect, useState} from 'react'
import personService from "./services/persons"

const App = () => {
    const [persons, setPersons] = useState([])
    const [newPerson, setNewPerson] = useState({name: "", number: ""})
    const [filter, setFilter] = useState("")
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const changeMessage = (message) => {
        setMessage(message)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

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
                    changeMessage({message: `Updated ${person.name} in the phonebook`, type: "notification"})
                })
                .catch(() => {
                    setPersons(persons.filter(p => p.id !== id))
                    changeMessage({message: `${person.name} is already removed from the server`, type: "error"})
                })
        }
        setNewPerson({name: "", number: ""})
    }

    const personDoesNotExist = (person) => {
        personService
            .addPerson(person)
            .then(responsePerson => {
                setPersons(persons.concat(responsePerson))
                changeMessage({message: `Added ${person.name} to the phonebook`, type: "notification"})
                setNewPerson({name: "", number: ""})
            })
            .catch(error => {
                changeMessage({message: error, type: "error"})
            })
    }

    const handleChange = (event, field) => {
        setNewPerson({
            ...newPerson,
            [field]: event.target.value
        })
    }

    const handleDelete = person => {
        if (window.confirm(`Delete ${person.name}?`)) {
            personService
                .deletePerson(person.id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== person.id))
                    changeMessage({message: `Deleted ${person.name} from the phonebook`, type: "notification"})
                })
        }
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message}/>
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

const Notification = ({message}) => {
    if (message === null) {
        return null
    }

    let notificationStyle = {
        background: "lightgrey",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    notificationStyle.color = message.type === "error" ? "red" : "green"

    return (
        <div style={notificationStyle}>
            {message.message}
        </div>
    )
}

export default App
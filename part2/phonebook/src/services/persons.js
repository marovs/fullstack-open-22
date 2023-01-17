import axios from "axios";
const baseUrl = "http://localhost:3001/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPerson = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const updatePerson = (id, person) => {
    const request = axios.put(`${baseUrl}/${id}`, person)
    return request.then(response => response.data)
}

const deletePerson = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    request.catch(() => {
        window.alert(`Person with id=${id} not found in db`)
    })
    return request
}

export default {
    getAll,
    addPerson,
    updatePerson,
    deletePerson
}
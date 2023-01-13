import {useState} from 'react'

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
    ]

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

    const nextAnecdote = () => {
        let random = selected
        while (random === selected) {
            random = randomInt()
        }
        setSelected(random)
    }

    const randomInt = () => {
        return Math.floor(Math.random() * anecdotes.length)
    }

    const voteOnAnecdote = () => {
        const newVotes = [...votes]
        newVotes[selected] += 1
        setVotes(newVotes)
    }

    const popularAnecdote = () => {
        return votes.indexOf(Math.max(...votes))
    }

    const popularIndex = popularAnecdote()

    return (
        <div>
            <Header title="Anecdote of the day"/>
            <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]}/>
            <Button onClick={voteOnAnecdote} text="vote"/>
            <Button onClick={nextAnecdote} text="next anecdote"/>
            <Header title="Anecdote with the most votes"/>
            <Anecdote anecdote={anecdotes[popularIndex]} votes={votes[popularIndex]}/>
        </div>
    )
}

const Header = ({title}) => {
    return (
        <h1>{title}</h1>
    )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Anecdote = ({anecdote, votes}) => {
    return (
        <div>
            <p>{anecdote}</p>
            <p>has {votes} votes</p>
        </div>
    )
}

export default App
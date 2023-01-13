import {useState} from "react";

const App = () => {
    const [stats, setStats] = useState({
        good: 0, neutral: 0, bad: 0, total: 0, average: 0, positive: 0
    })

    const updateStats = (value) => {
        let newStats = {
            ...stats,
            [value]: stats[value] + 1,
            total: stats.total + 1
        }
        newStats = calculateStats(newStats)
        setStats(newStats)
    }

    const calculateStats = (stats) => {
        stats.average = (stats.good + stats.bad * (-1)) / stats.total
        const positive = (stats.good / stats.total) * 100
        stats.positive = positive.toString().concat(" %")
        return stats
    }

    return (
        <div>
            <Header title="Give Feedback"/>
            <Button onClick={() => updateStats("good")} text="good"/>
            <Button onClick={() => updateStats("neutral")} text="neutral"/>
            <Button onClick={() => updateStats("bad")} text="bad"/>
            <Header title="Statistics"/>
            <Statistics stats={stats}/>
        </div>
    )
}

const Header = ({title}) => {
    return (
        <h1>{title}</h1>
    )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({stats}) => {
    if (stats.total === 0) {
        return (
            <div>
                No feedback given
            </div>
        )
    }
    return (
        <table>
            <tbody>
                <StatisticLine text="good" value={stats.good}/>
                <StatisticLine text="neutral" value={stats.neutral}/>
                <StatisticLine text="bad" value={stats.bad}/>
                <StatisticLine text="total" value={stats.total}/>
                <StatisticLine text="average" value={stats.average}/>
                <StatisticLine text="positive" value={stats.positive}/>
            </tbody>
        </table>
    )
}

const StatisticLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

export default App
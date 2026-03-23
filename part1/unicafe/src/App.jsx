import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad}) => {
  const total = good + bad + neutral
  const average = (good-bad)/total
  const positive = (good*100)/total + ' %'
  

  if(total === 0){
    return <p>No feedback given</p>
  }
  
  return (
    <div>
      <table>
        <StadisticLine text={'good'} value={good}/>
        <StadisticLine text={'neutral'} value={neutral}/>
        <StadisticLine text={'bad'} value={bad}/>
        <StadisticLine text={'all'} value={total}/>
        <StadisticLine text={'average'} value={average}/>
        <StadisticLine text={'positive'} value={positive}/>
      </table>
    </div>
  )
}

const StadisticLine = ({text, value}) => {
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </tbody>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => {
    console.log('before good', good)
    const newGood = good + 1
    setGood(newGood)
    console.log('after good', newGood)
  }

  const incrementNeutral = () =>{
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
  }

  const incrementBad = () => {
    const newBad = bad + 1
    setBad(newBad)
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={incrementGood} text={'good'}/>
      <Button onClick={incrementNeutral} text={'neutral'}/>
      <Button onClick={incrementBad} text={'bad'}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryRender = (props) => {
  const countriesToShow = props.countriesToShow
  const input = props.input
  const setinput = props.setinput
  const showButton = props.showButton
  const weather = props.weather


  if(input === ''){
    return(
      <div>
        <p>No entries, type something</p>
      </div>
    )
  }

  if(countriesToShow.length > 10){
    return(
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }
  if(countriesToShow.length > 1){
    return(
      <div>
        {countriesToShow.map(country => 
        <li key={country.ccn3}>
          {country.name.common}
          <button onClick={() => showButton(country.name.common)}>show</button>
        </li>)}
      </div>
    )
  }

  if (countriesToShow.length === 0) {
  return <p>No matches found</p>
  }

  if(countriesToShow.length === 1){
    const country = countriesToShow[0]
    console.log(country)
    return(
      <div>
        <h1>{country.name.common}</h1>
        <li>Capital {country.capital}</li>
        <li>Area {country.area}</li>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`}/>
        {weather && (
          <div>
            <h3>Weather in {country.capital}</h3>
            <p>Temperature: {weather.main.temp} Celsius</p>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="weather icon" 
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    )
  }
  
}



function App() {
  const [input, setinput] = useState(null)
  const [allCountries, setAllCountries] = useState(null)
  const [countriesToShow, setCountriesToShow] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const capital = countriesToShow[0].capital[0]
      const api_key = import.meta.env.VITE_SOME_KEY
      console.log('Enviando petición con esta llave:', api_key)
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [countriesToShow])

  useEffect(() => {
      console.log('llamada inicial api')
      axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log(response.data)
        setAllCountries(response.data)
      })  
    
  },[])

  const showButton = (name) => {
    console.log(name)
    setinput(name)
    setCountriesToShow (allCountries.filter((country) => 
      country.name.common.toLowerCase().includes(name.toLowerCase())
    ) )
  }

  const handleChange = (event) => {
    const value = event.target.value
    setinput(value)
    console.log(value)
    
    if(value != null){
    setCountriesToShow (allCountries.filter((country) => 
      country.name.common.toLowerCase().includes(value.toLowerCase())
    ) )
    }
    console.log(countriesToShow)
  }

  return (
    <div>
      find countries: <input onChange={handleChange}/>
      <div>

        <CountryRender countriesToShow={countriesToShow} input={input} setinput={setinput} showButton={showButton} weather={weather}/>

      </div>
    </div>
  )
}

export default App

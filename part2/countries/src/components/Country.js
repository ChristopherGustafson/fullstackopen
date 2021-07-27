import React, {useEffect, useState} from "react";
import axios from "axios";

const Country = ({country}) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const apiUrl = "http://api.weatherstack.com/current?";
    const apiKeyParam = `access_key=${process.env.REACT_APP_API_KEY}`;
    const countryParam = `&query=${country.capital}`;
    const completeApiUrl = `${apiUrl}${apiKeyParam}${countryParam}`;
    axios.get(completeApiUrl).then((response) => {
      setWeather(response.data.current);
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>Languages</h2>
      <ul>
        {country.languages.map((lang) => (
          <li key={lang.name}>{lang.name}</li>
        ))}
      </ul>
      <img src={country.flag} alt={country.name} width="200px" />

      <h1>Weather in {country.capital}</h1>
      <p>Temperature: {weather.temperature} degrees</p>
      {weather.weather_icons
        ? weather.weather_icons.map((icon) => (
            <img key={icon} src={icon} alt="weather icon" />
          ))
        : "no data"}
      <p>wind speed: {weather.wind_speed} mph</p>
      <p>wind direction: {weather.wind_dir}</p>
    </div>
  );
};
export default Country;

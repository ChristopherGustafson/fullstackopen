import React, {useState, useEffect} from "react";
import axios from "axios";

import Country from "./components/Country";

const Content = ({countries, setFilter}) => {
  const handleClick = (event) => {
    setFilter(event.target.value);
  };

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length === 1) {
    return <Country country={countries[0]} />;
  } else if (countries.length === 0) {
    return <p>No matches</p>;
  }
  return (
    <>
      {countries.map((country) => {
        return (
          <div key={country.name}>
            {country.name}
            <button value={country.name} onClick={handleClick}>
              show
            </button>
          </div>
        );
      })}
    </>
  );
};

const App = () => {
  const apiUrl = "https://restcountries.eu/rest/v2/all";
  const [filter, setFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get(apiUrl).then((response) => {
      setCountries(response.data);
      console.log(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <div>
        find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
      <Content
        countries={countries.filter((country) =>
          country.name.toLowerCase().includes(filter.toLowerCase())
        )}
        setFilter={(country) => setFilter(country)}
      />
    </div>
  );
};

export default App;

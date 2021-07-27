import React, {useState, useEffect} from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import PersonService from "./services/personService";

const App = () => {
  const [persons, setPersons] = useState([
    {name: "Arto Hellas", number: "040-123456"},
    {name: "Ada Lovelace", number: "39-44-5323523"},
    {name: "Dan Abramov", number: "12-43-234345"},
    {name: "Mary Poppendieck", number: "39-23-6423122"},
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    PersonService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  /* Event Handlers */
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        PersonService.update(existingPerson.id, {
          name: newName,
          number: newNumber,
        }).then((response) =>
          setPersons(
            persons.map((person) =>
              person.id === response.id ? response : person
            )
          )
        );
      }
    } else {
      PersonService.create({name: newName, number: newNumber})
        .then((returnedPerson) => setPersons(persons.concat(returnedPerson)))
        .catch((error) => {
          console.log("Error, ", error);
        });
    }

    // Reset input fields
    setNewName("");
    setNewNumber("");
  };

  const removePerson = (event) => {
    event.preventDefault();
    if (
      window.confirm(
        `Delete ${
          persons.find((person) => person.id.toString() === event.target.value)
            .name
        }?`
      )
    ) {
      PersonService.remove(event.target.value).then((response) => {
        console.log(response);
      });
      setPersons(
        persons.filter((person) => person.id.toString() !== event.target.value)
      );
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>

      <Persons persons={persons} filter={filter} handleClick={removePerson} />
    </div>
  );
};

export default App;

import React, {useState, useEffect} from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import PersonService from "./services/personService";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    PersonService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  // Show message, hide after 5 seconds
  const showMessage = (message, type) => {
    if (type === "error") {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } else if (type === "success") {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

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
        })
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === response.id ? response : person
              )
            );
            showMessage(
              `The number of ${response.name} was changed`,
              "success"
            );
          })
          .catch((error) => {
            showMessage(error.response.data, "error");
          });
      }
    } else {
      PersonService.create({name: newName, number: newNumber})
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showMessage(
            `${returnedPerson.name} was added to the phonebook`,
            "success"
          );
        })
        .catch((error) => {
          showMessage(error.response.data, "error");
        });
    }

    // Reset input fields
    setNewName("");
    setNewNumber("");
  };

  const removePerson = (event) => {
    event.preventDefault();
    const personToRemove = persons.find(
      (person) => person.id.toString() === event.target.value
    );
    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      PersonService.remove(personToRemove.id)
        .then((response) => {
          showMessage(
            `${personToRemove.name} was removed from the server`,
            "success"
          );
        })
        .catch((error) => {
          showMessage(
            `${personToRemove.name} is already removed from the server`,
            "error"
          );
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
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
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

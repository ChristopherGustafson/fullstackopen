const Persons = ({persons, filter, handleClick}) => {
  return (
    <>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        )
        .map((person) => (
          <div key={person.name}>
            {person.name} {person.number}{" "}
            <button value={person.id} onClick={handleClick}>
              delete
            </button>
          </div>
        ))}
    </>
  );
};

export default Persons;

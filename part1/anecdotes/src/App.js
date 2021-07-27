import React, {useState} from "react";

const Anecdote = ({anecdote, points}) => (
  <>
    <p>{anecdote}</p>
    <p>has {points} votes</p>
  </>
);

const Button = ({text, handleClick}) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients",
  ];

  const [selected, setSelected] = useState(0);
  // Points is an array of equal length to anecdotes, with zeros for every element. Each element corresponds to the points of the anecdote with the same index in the anecdotes array.
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));
  const [highest, setHighest] = useState(0);

  const handleNextClick = () => {
    let newAnecdote = Math.floor(Math.random() * anecdotes.length);
    while (newAnecdote === selected) {
      newAnecdote = Math.floor(Math.random() * anecdotes.length);
    }
    setSelected(newAnecdote);
  };

  const handleVoteClick = () => {
    const newPoints = [...points];
    newPoints[selected] += 1;
    if (newPoints[selected] > points[highest]) {
      setHighest(selected);
    }
    setPoints(newPoints);
  };

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <Anecdote anecdote={anecdotes[selected]} points={points[selected]} />
        <Button text="next anecdote" handleClick={handleNextClick} />
        <Button text="vote" handleClick={handleVoteClick} />
      </div>
      <div>
        <h1>Anecdote with most votes</h1>
        <Anecdote anecdote={anecdotes[highest]} points={points[highest]} />
      </div>
    </>
  );
};

export default App;

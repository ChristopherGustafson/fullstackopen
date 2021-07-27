import React, {useState} from "react";

const Header = ({text}) => <h1>{text}</h1>;

const average = (values) => {
  let sum = 0;
  let elems = 0;
  values.forEach(({amount, value}) => {
    sum += amount * value;
    elems += amount;
  });
  if (elems) return sum / elems;
  else return "-";
};

const percentage = (part, total) => {
  if (total) return (part / total) * 100;
  else return "-";
};
const Statistic = ({text, value, unit}) => (
  <tr>
    <td>{text}</td>
    <td>
      {value}
      {unit}
    </td>
  </tr>
);
const Statistics = ({good, neutral, bad}) => {
  return good || neutral || bad ? (
    <table>
      <tbody>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic
          text="average"
          value={average([
            {amount: good, value: 1},
            {amount: neutral, value: 0},
            {amount: bad, value: -1},
          ])}
        />
        <Statistic
          text="positive"
          value={percentage(good, good + neutral + bad)}
          unit="%"
        />
      </tbody>
    </table>
  ) : (
    <p>No feedback given</p>
  );
};

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => {
    setGood(good + 1);
  };
  const incrementNeutral = () => {
    setNeutral(neutral + 1);
  };
  const incrementBad = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <Header text="Give Feedback" />
      <Button text="Good" handleClick={incrementGood} />
      <Button text="Neutral" handleClick={incrementNeutral} />
      <Button text="Bad" handleClick={incrementBad} />

      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;

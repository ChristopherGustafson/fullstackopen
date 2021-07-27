import React from "react";

const Header = ({text}) => {
  return <h1>{text}</h1>;
};
const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part) => {
        return (
          <Part name={part.name} exercises={part.exercises} key={part.id} />
        );
      })}
      <Total parts={parts} />
    </div>
  );
};
const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};
const Total = ({parts}) => {
  const total = parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

const Course = ({course}) => {
  const {name, parts} = course;
  return (
    <>
      <Header text={name} />
      <Content parts={parts} />
    </>
  );
};

export default Course;

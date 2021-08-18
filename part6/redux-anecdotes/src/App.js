import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import anecdoteService from "./services/anecdotes";
import {initAnecdotes} from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();

  // Initialize anecdotes on render
  useEffect(() => {
    anecdoteService.getAll().then((anectodes) => {
      dispatch(initAnecdotes(anectodes));
    });
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;

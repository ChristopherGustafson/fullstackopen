import {useDispatch} from "react-redux";
import {createAnecdote} from "../reducers/anecdoteReducer";
import anecdoteService from "../services/anecdotes";
import {
  removeNotification,
  setNotification,
} from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const create = async (event) => {
    event.preventDefault();
    const anecdote = event.target.anecdote.value;
    dispatch(createAnecdote(anecdote));
    event.target.anecdote.value = "";
    dispatch(setNotification(`Created new anecdote "${anecdote}"`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;

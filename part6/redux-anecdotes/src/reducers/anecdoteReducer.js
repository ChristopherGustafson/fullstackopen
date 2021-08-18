import anecdoteService from "../services/anecdotes";

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case "UPDATE":
      return state.map((anecdote) =>
        anecdote.id.toString() === action.anecdote.id
          ? action.anecdote
          : anecdote
      );
    case "CREATE":
      return [...state, action.data];
    case "INIT":
      return action.data;
    default:
      return state;
  }
};

export const voteAnecdote = (anecdote) => {
  const votedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(votedAnecdote);
    dispatch({
      type: "UPDATE",
      anecdote: updatedAnecdote,
    });
  };
};

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.create(anecdote);
    dispatch({
      type: "CREATE",
      data: createdAnecdote,
    });
  };
};

export const initAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: "INIT",
      data: anecdotes,
    });
  };
};

export default anecdoteReducer;

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case "VOTE":
      return state.map((anecdote) =>
        anecdote.id.toString() === action.data.id
          ? {...anecdote, votes: anecdote.votes + 1}
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

export const voteAnecdote = (id) => {
  return {
    type: "VOTE",
    data: {
      id,
    },
  };
};

export const createAnecdote = (anecdote) => {
  return {
    type: "CREATE",
    data: anecdote,
  };
};

export const initAnecdotes = (anecdotes) => {
  return {
    type: "INIT",
    data: anecdotes,
  };
};

export default anecdoteReducer;

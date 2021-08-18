const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return action.message;
    default:
      return state;
  }
};

export const setNotification = (message, duration) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_MESSAGE",
      message,
    });
    setTimeout(() => dispatch(removeNotification()), duration * 1000);
  };
};

export const removeNotification = () => {
  return {
    type: "SET_MESSAGE",
    message: "",
  };
};

export default notificationReducer;

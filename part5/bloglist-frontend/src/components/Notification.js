import React from "react";
// Possible notification types: error, success
const notificationStyles = {
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const errorStyles = {
  color: "red",
};
const successStyles = {
  color: "green",
};

const Notification = ({message, type}) => {
  if (message === null) {
    return null;
  }

  if (type === "error") {
    return <div style={{...notificationStyles, ...errorStyles}}>{message}</div>;
  } else if (type === "success") {
    return (
      <div style={{...notificationStyles, ...successStyles}}>{message}</div>
    );
  }
  return <div style={notificationStyles}>{message}</div>;
};

export default Notification;

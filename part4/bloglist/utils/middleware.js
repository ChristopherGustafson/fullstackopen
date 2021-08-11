const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  console.log(error.name);
  // If cast error, user has inputted faulty id, send back 400 Bad Request
  if (error.name === "CastError") {
    return response.status(400).send("malformatted id");
  } else if (error.name === "ValidationError") {
    return response.status(400).send({error: error.message});
  }
  // Otherwise use default error handler of express
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};

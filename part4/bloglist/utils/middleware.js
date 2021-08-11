const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  // If cast error, user has inputted faulty id, send back 400 Bad Request
  if (error.name === "CastError") {
    return response.status(400).send("malformatted id");
  } else if (error.name === "ValidationError") {
    return response.status(400).send({error: error.message});
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).send({error: error.message});
  }
  // Otherwise use default error handler of express
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const auth = request.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    request.token = auth.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({error: "token missing"});
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({error: "token invalid"});
  }
  const user = await User.findById(decodedToken.id);
  if (user) request.user = user;
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};

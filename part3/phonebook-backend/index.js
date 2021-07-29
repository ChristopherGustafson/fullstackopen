require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const PORT = process.env.PORT;

// Serve frontend as static frontend build in "build" folder
app.use(express.static("build"));
// Express json parser
app.use(express.json());
// Allow for CORS requests
app.use(cors());

// Use custom formatted logging with morgan
morgan.token("content", (request, response) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

// All persons data endpoint
app.get("/api/persons", (request, response, next) => {
  console.log("Request for all persons");
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

// Single person data endpoint
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Add new person data endpoint
app.post("/api/persons", (request, response, next) => {
  const newPerson = request.body;
  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

// Alter existing person data endpoint
app.put("/api/persons/:id", (request, response, next) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Delete person endpoint
app.delete("/api/persons/:id", (request, response, next) => {
  console.log("Request to delete person with id ", request.params.id);
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      console.log(result);
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

// Phonebook info endpoint
app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>The phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
      );
    })
    .catch((error) => {
      next(error);
    });
});

// Catches all endpoints that didn't match above, responds with 404 Not Found
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: "unknown endpoint"});
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  // If cast error, user has inputted faulty id, send back 400 Bad Request
  if (error.name === "CastError") {
    return response.status(400).send("malformatted id");
  } else if (error.name === "ValidationError") {
    return response.status(400).send(error.message);
  }
  // Otherwise use default error handler of express
  next(error);
};

app.use(errorHandler);

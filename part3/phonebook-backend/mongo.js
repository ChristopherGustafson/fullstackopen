const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide all necessary command line arguments: node mongo.js <password> or node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://phonebook:${password}@cluster0.vd5ov.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// Define model for a Person
const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", PersonSchema);

if (process.argv.length < 5) {
  // If not name and number is provided, show all persons in the phonebook
  Person.find({}).then((persons) => {
    console.log("Phonebook:");
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  // Add the new person to the phonebook
  const person = new Person({
    id: Math.floor(Math.random() * 100000),
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(
      `Added ${result.name} number ${result.number} to the phonebook`
    );
    mongoose.connection.close();
  });
}

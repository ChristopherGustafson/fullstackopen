const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./test_utils");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    // Delete all current users, then add one single user
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({username: "root", passwordHash});
    await user.save();
  });

  test("creation succeeds with a fresh account", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Stoffeman",
      name: "Stoffe",
      password: "cookies",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  }, 100000);

  test("creation fails when account with existing username is created", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Stoffe",
      password: "cookies",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  }, 100000);

  test("creation fails when account with invalid username is created", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "rt",
      name: "Stoffe",
      password: "cookies",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("User validation failed");
    expect(result.body.error).toContain("username");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  }, 100000);

  test("creation fails when account with invalid password is created", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Stoffe",
      password: "co",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("User validation failed");
    expect(result.body.error).toContain("password");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});

const userStorage = "loggedInUser";

Cypress.Commands.add("login", ({username, password}) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then((response) => {
    localStorage.setItem(userStorage, JSON.stringify(response.body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createPost", ({title, author, url}) => {
  cy.request({
    url: "http://localhost:3003/api/blogs",
    method: "POST",
    body: {
      title,
      author,
      url,
    },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem(userStorage)).token
      }`,
    },
  });
  cy.visit("http://localhost:3000");
});

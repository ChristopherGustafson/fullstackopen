const exampleBlog = {
  title: "This is a title",
  author: "Author authorsson",
  url: "www.blog.com/thisisatitle",
};

describe("Bloglist app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Christopher Gustafson",
      username: "stoffe",
      password: "secret",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("Frontpage shows login form", function () {
    cy.get("#username-input");
    cy.get("#password-input");
  });

  describe("Login", function () {
    it("Succeeds with correct credentials", function () {
      cy.get("#username-input").type("stoffe");
      cy.get("#password-input").type("secret");
      cy.get("#login-button").click();

      cy.contains("logged in");
    });

    it("Fails with wrong credentials", function () {
      cy.get("#username-input").type("stoffe");
      cy.get("#password-input").type("wrongpass");
      cy.get("#login-button").click();

      cy.get(".error").contains("Wrong credentials");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({username: "stoffe", password: "secret"});
    });

    it("A blog can be created", function () {
      cy.contains("Create new blog").click();
      cy.get("#title").type(exampleBlog.title);
      cy.get("#author").type(exampleBlog.author);
      cy.get("#url").type(exampleBlog.url);
      cy.get("#blog-submit-button").click();

      cy.get(".blog-title").contains(exampleBlog.title);
      cy.get(".blog-author").contains(exampleBlog.author);
    });

    describe("When a blog is created", function () {
      beforeEach(function () {
        // Create blog before each test
        cy.createPost(exampleBlog);
      });

      it("A blog can be liked", function () {
        cy.contains("View").click();
        cy.get(".blog-likes-number").then(($initialLikes) => {
          const l1 = parseInt($initialLikes.text());
          cy.contains("Like").click();

          // Wait to make sure like has time to update
          cy.wait(100);
          cy.get(".blog-likes-number").then(($likes) => {
            const l2 = parseInt($likes.text());
            expect(l1 + 1).to.eq(l2);
          });
        });
      });

      it("A blog can be deleted", function () {
        cy.contains("View").click();
        cy.contains("Remove").click();
        cy.get(".blog-title").should("not.exist");
        cy.get(".blog-author").should("not.exist");
      });
    });

    describe("When there are multiple blogs", function () {
      beforeEach(function () {
        cy.createPost({...exampleBlog, title: "First title"});
        cy.createPost({...exampleBlog, title: "Second title"});
        cy.createPost({...exampleBlog, title: "Third title"});
      });

      it.only("Blogs are sorted after likes", function () {
        // Click third post like button twice
        cy.contains("Third title").parent().contains("View").click();
        cy.contains("Third title").parent().contains("Like").click();
        cy.wait(100);
        cy.contains("Third title").parent().contains("Like").click();
        cy.wait(100);

        // Click second post like button once
        cy.contains("Second title").parent().contains("View").click();
        cy.contains("Second title").parent().contains("Like").click();
        cy.wait(100);

        // Elements are now expected to be in reversed order
        cy.get(".blog-title").eq(0).contains("Third title");
        cy.get(".blog-title").eq(1).contains("Second title");
        cy.get(".blog-title").eq(2).contains("First title");
      });

      cy;
    });
  });
});

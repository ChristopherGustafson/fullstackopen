import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {render} from "@testing-library/react";
import Blog from "./Blog";

test("Renders correct content", () => {
  const blog = {
    title: "Component testing",
    author: "Test author",
    url: "www.test.com",
    likes: 10,
  };
  // Since we only want to test rendered content, handlers are kept as empty
  const handleLike = () => {};
  const handleDelete = () => {};
  const isDeletable = false;
  const component = render(
    <Blog
      blog={blog}
      handleLike={handleLike}
      handleDelete={handleDelete}
      isDeletable={isDeletable}
    />
  );

  // Check that the blog has title
  const titleDiv = component.container.querySelector(".blog-title");
  expect(titleDiv).toHaveTextContent(blog.title);

  // Check that the blog has title
  const authorDiv = component.container.querySelector(".blog-author");
  expect(authorDiv).toHaveTextContent(blog.author);

  // Check that the blog doesn't show the url
  const urlDiv = component.container.querySelector(".blog-url");
  expect(urlDiv.parentElement).toHaveStyle("display: none");

  // Check the blog has title
  const likesDiv = component.container.querySelector(".blog-likes");
  expect(likesDiv.parentElement).toHaveStyle("display: none");
});

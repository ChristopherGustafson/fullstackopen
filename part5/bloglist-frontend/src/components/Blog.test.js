import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {render, fireEvent} from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog /> component tests", () => {
  let component;
  const blog = {
    title: "Component testing",
    author: "Test author",
    url: "www.test.com",
    likes: 10,
  };
  let mockHandleLike;
  let mockHandleDelete;

  beforeEach(() => {
    // Since we only want to test rendered content, handlers are kept as empty
    mockHandleLike = jest.fn();
    mockHandleDelete = jest.fn();
    const isDeletable = false;

    component = render(
      <Blog
        blog={blog}
        handleLike={mockHandleLike}
        handleDelete={mockHandleDelete}
        isDeletable={isDeletable}
      />
    );
  });

  test("Renders correct content", () => {
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

  test("Clicking a view button to correctly show content", () => {
    // Check the blog doesn't display the blog url
    const urlDiv = component.container.querySelector(".blog-url");
    expect(urlDiv.parentElement).toHaveStyle("display: none");

    // Check the blog doesn't display blog likes
    const likesDiv = component.container.querySelector(".blog-likes");
    expect(likesDiv.parentElement).toHaveStyle("display: none");

    // Click the view button
    const toggleButton = component.getByText("View");
    fireEvent.click(toggleButton);

    // Check that
    expect(urlDiv.parentElement).not.toHaveStyle("display: none");
    expect(likesDiv.parentElement).not.toHaveStyle("display: none");
  });

  test("Checking that the like button fire the given handler properly", () => {
    // Click the like button twice
    const likeButton = component.getByText("Like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandleLike.mock.calls).toHaveLength(2);
  });
});

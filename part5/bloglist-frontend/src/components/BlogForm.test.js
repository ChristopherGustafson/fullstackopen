import React from "react";
import "@testing-library/jest-dom/extend-expect";
import {render, fireEvent} from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("<BlogForm /> component tests", () => {
  const blog = {
    title: "Component testing",
    author: "Test author",
    url: "www.test.com",
    likes: 10,
  };

  test("Submitting a form with field values passes the right values to the handler", () => {
    const mockHandler = jest.fn();

    const component = render(<BlogForm handleBlogSubmit={mockHandler} />);
    const form = component.container.querySelector("form");
    const titleInput = component.container.querySelector("#title");
    const authorInput = component.container.querySelector("#author");
    const urlInput = component.container.querySelector("#url");

    fireEvent.change(titleInput, {
      target: {
        value: blog.title,
      },
    });
    fireEvent.change(authorInput, {
      target: {
        value: blog.author,
      },
    });
    fireEvent.change(urlInput, {
      target: {
        value: blog.url,
      },
    });

    fireEvent.submit(form);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].title).toBe(blog.title);
    expect(mockHandler.mock.calls[0][0].author).toBe(blog.author);
    expect(mockHandler.mock.calls[0][0].url).toBe(blog.url);
  });
});

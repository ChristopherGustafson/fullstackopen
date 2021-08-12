import React from "react";
import Togglable from "./Togglable";
const Blog = ({blog, handleLike}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <br />
      <Togglable buttonLabel="View">
        {blog.url}
        <br />
        Likes {blog.likes}{" "}
        <button onClick={() => handleLike(blog)}>Like</button>
        <br />
        {blog.user ? blog.user.name : ""}
        <br />
      </Togglable>
    </div>
  );
};

export default Blog;

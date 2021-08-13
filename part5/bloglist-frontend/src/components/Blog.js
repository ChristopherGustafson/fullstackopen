import React from "react";
import PropTypes from "prop-types";
import Togglable from "./Togglable";
const Blog = ({blog, handleLike, handleDelete, isDeletable}) => {
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
        {isDeletable && (
          <button
            onClick={() => {
              if (window.confirm(`Do you want to remove ${blog.title}`))
                handleDelete(blog.id);
            }}
          >
            Remove
          </button>
        )}
      </Togglable>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
};

export default Blog;

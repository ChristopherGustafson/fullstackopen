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
      <div className="blog-title">{blog.title}</div>
      <div className="blog-author">{blog.author}</div>
      <Togglable buttonLabel="View">
        <div className="blog-url">{blog.url}</div>
        <div className="blog-likes">
          Likes {blog.likes}{" "}
          <button onClick={() => handleLike(blog)}>Like</button>{" "}
        </div>
        <div>{blog.user ? blog.user.name : ""}</div>
        <div>
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
        </div>
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

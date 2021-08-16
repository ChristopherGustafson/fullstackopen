import React, {useState} from "react";

const BlogForm = ({handleBlogSubmit}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Create new blog form field change handlers
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create new blog
    handleBlogSubmit({title: newTitle, author: newAuthor, url: newUrl});
    // Reset field values
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Title
        <input
          id="title"
          type="text"
          value={newTitle}
          name="Title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        Author
        <input
          id="author"
          type="text"
          value={newAuthor}
          name="Author"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        URL
        <input
          id="url"
          type="text"
          value={newUrl}
          name="Url"
          onChange={handleUrlChange}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default BlogForm;

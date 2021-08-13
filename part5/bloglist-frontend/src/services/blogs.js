import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: {Authorization: token},
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: {Authorization: token},
  };
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

const like = async (blog) => {
  const config = {
    headers: {Authorization: token},
  };
  const blogData = {
    user: blog.user.id,
    likes: blog.likes + 1,
    title: blog.title,
    author: blog.author,
    url: blog.url,
  };
  const response = await axios.put(`${baseUrl}/${blog.id}`, blogData, config);
  return response.data;
};

const blogService = {getAll, create, remove, like, setToken};

export default blogService;

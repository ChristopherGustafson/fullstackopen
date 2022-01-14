const totalLikes = (blogs) => {
  return blogs.reduce((acc, next) => {
    return acc + next.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  let favoriteBlog = blogs[0];
  let maxLikes = 0;
  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      favoriteBlog = blog;
      maxLikes = blog.likes;
    }
  });
  return favoriteBlog;
};

module.exports = {
  totalLikes,
  favoriteBlog,
};

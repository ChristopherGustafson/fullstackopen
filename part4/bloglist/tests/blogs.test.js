const listHelper = require("../utils/list_helper");
const {blogs1, blogs2, blogs3} = require("./blogsTestData");

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(blogs1);
    expect(result).toBe(5);
  });

  test("should equal 24", () => {
    const result = listHelper.totalLikes(blogs2);
    expect(result).toBe(24);
  });

  test("should equal 36", () => {
    const result = listHelper.totalLikes(blogs3);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, equals that blog", () => {
    const result = listHelper.favoriteBlog(blogs1);
    expect(result).toEqual(blogs1[0]);
  });
  test("should be second blog in list", () => {
    const result = listHelper.favoriteBlog(blogs2);
    expect(result).toEqual(blogs2[1]);
  });
  test("should be third blog in list", () => {
    const result = listHelper.favoriteBlog(blogs3);
    expect(result).toEqual(blogs3[2]);
  });
});

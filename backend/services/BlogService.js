const blogRepository = require("../repositories/BlogRepository");

class BlogService {
  async createBlog(clerkUserId, blogData) {
    const newBlog = { ...blogData, clerkUserId };
    return await blogRepository.create(newBlog);
  }

  async getAllBlogs() {
    return await blogRepository.findAll();
  }

  async getBlogById(id) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return blog;
  }

  async updateBlog(id, updateData) {
    const updatedBlog = await blogRepository.update(id, updateData);
    if (!updatedBlog) {
      throw new Error("Blog not found");
    }
    return updatedBlog;
  }

  async deleteBlog(id) {
    const deletedBlog = await blogRepository.delete(id);
    if (!deletedBlog) {
      throw new Error("Blog not found");
    }
    return deletedBlog;
  }

  async countBlogsByUserId(userId) {
    return await blogRepository.countByUserId(userId);
  }

  async getBlogsByUserId(userId) {
    return await blogRepository.findByUserId(userId);
  }
}

module.exports = new BlogService();

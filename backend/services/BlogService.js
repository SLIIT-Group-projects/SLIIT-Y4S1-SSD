const blogRepository = require("../repositories/BlogRepository");

class BlogService {
  // Create a new blog
  async createBlog(clerkUserId, blogData) {
    // Only allow whitelisted fields
    const allowedFields = ["title", "content", "images", "videos"];
    const newBlog = { clerkUserId };
    allowedFields.forEach((key) => {
      if (blogData[key] !== undefined) newBlog[key] = blogData[key];
    });
    return await blogRepository.create(newBlog);
  }

  // Get all blogs (public)
  async getAllBlogs() {
    return await blogRepository.findAll();
  }

  // Get blog by ID
  async getBlogById(id) {
    return await blogRepository.findById(id); // Returns null if not found
  }

  // Update a blog (only whitelisted fields)
  async updateBlog(id, updateData) {
    const allowedFields = ["title", "content", "images", "videos"];
    const filteredData = {};
    allowedFields.forEach((key) => {
      if (updateData[key] !== undefined) filteredData[key] = updateData[key];
    });

    const updatedBlog = await blogRepository.update(id, filteredData);
    return updatedBlog; // Returns null if blog not found
  }

  // Delete a blog
  async deleteBlog(id) {
    const deletedBlog = await blogRepository.delete(id);
    return deletedBlog; // Returns null if blog not found
  }

  // Count blogs by user
  async countBlogsByUserId(userId) {
    return await blogRepository.countByUserId(userId);
  }

  // Get blogs for a specific user
  async getBlogsByUserId(userId) {
    return await blogRepository.findByUserId(userId);
  }
}

module.exports = new BlogService();

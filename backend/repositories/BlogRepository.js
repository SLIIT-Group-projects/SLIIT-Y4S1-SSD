const Blog = require("../models/blog"); // Adjust path as necessary

class BlogRepository {
  async create(blogData) {
    const blog = new Blog(blogData);
    return await blog.save();
  }

  async findAll() {
    return await Blog.find();
  }

  async findById(id) {
    return await Blog.findById(id);
  }

  async update(id, updateData) {
    return await Blog.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Blog.findByIdAndDelete(id);
  }

  async countByUserId(userId) {
    return await Blog.countDocuments({ clerkUserId: userId });
  }

  async findByUserId(userId) {
    return await Blog.find({ clerkUserId: userId });
  }
}

module.exports = new BlogRepository();

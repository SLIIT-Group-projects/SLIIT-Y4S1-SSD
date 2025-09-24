const express = require("express");
const multer = require("multer");
const path = require("path");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { body, validationResult } = require("express-validator");

const BlogService = require("../services/BlogService");

const router = express.Router();

// ================== Multer Storage ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ================== Validation Middleware ==================
const validateBlog = [
  body("title").isString().isLength({ min: 3, max: 100 }),
  body("content").isString().isLength({ min: 5, max: 5000 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// ================== Ownership Middleware ==================
async function requireBlogOwnership(req, res, next) {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.clerkUserId !== req.auth.userId) {
      return res.status(403).json({ message: "Forbidden: You cannot modify this blog" });
    }
    req.blog = blog;
    next();
  } catch (err) {
    console.error("Error in ownership check:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// ================== Routes ==================

// POST: Create blog (authenticated user)
router.post(
  "/create-blog",
  ClerkExpressRequireAuth(),
  upload.fields([{ name: "images" }, { name: "videos" }]),
  validateBlog,
  async (req, res) => {
    try {
      const clerkUserId = req.auth.userId;
      const { title, content } = req.body;

      const images = req.files?.images?.map(f => f.path) || [];
      const videos = req.files?.videos?.map(f => f.path) || [];

      const newBlog = await BlogService.createBlog(clerkUserId, { title, content, images, videos });
      res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET: All blogs (public)
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: Blog by ID (public)
router.get("/get-blog/:id", async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(404).json({ message: "Blog not found" });
  }
});

// PUT: Update blog (owner only)
router.put(
  "/update-blog/:id",
  ClerkExpressRequireAuth(),
  requireBlogOwnership,
  upload.fields([{ name: "images" }, { name: "videos" }]),
  validateBlog,
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const updateData = { title, content };

      if (req.files.images) updateData.images = req.files.images.map(f => f.path);
      if (req.files.videos) updateData.videos = req.files.videos.map(f => f.path);

      const updatedBlog = await BlogService.updateBlog(req.params.id, updateData);
      res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (err) {
      console.error("Error updating blog:", err);
      res.status(404).json({ message: "Blog not found." });
    }
  }
);

// GET: Blogs of current user
router.get("/get-doctor-blogs", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const blogs = await BlogService.getBlogsByUserId(userId);
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Delete blog (owner only)
router.delete(
  "/delete-blog/:id",
  ClerkExpressRequireAuth(),
  requireBlogOwnership,
  async (req, res) => {
    try {
      await BlogService.deleteBlog(req.params.id);
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("Error deleting blog:", err);
      res.status(404).json({ message: "Blog not found." });
    }
  }
);

// GET: Blog count of current user
router.get("/blog-count", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const count = await BlogService.countBlogsByUserId(clerkUserId);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching blog count:", err);
    res.status(500).json({ message: "Failed to fetch blog count" });
  }
});

module.exports = router;


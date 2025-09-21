const express = require("express");
const multer = require("multer");
const BlogService = require("../services/BlogService");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const path = require("path");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use the original file extension
  },
});

const upload = multer({ storage: storage });

// POST request to create a new blog
router.post(
  "/create-blog",
  ClerkExpressRequireAuth(),
  upload.fields([{ name: "images" }, { name: "videos" }]),
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    try {
      const blogData = req.body;

      const imagePaths = req.files?.images
        ? req.files.images.map((file) => file.path)
        : [];

      const videoPaths = req.files?.videos
        ? req.files.videos.map((file) => file.path)
        : [];

      const newBlog = await BlogService.createBlog(clerkUserId, {
        ...blogData,
        images: imagePaths,
        videos: videoPaths,
      });

      res
        .status(201)
        .json({ message: "Blog post created successfully", blog: newBlog });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET all blogs
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET blog by ID
router.get("/get-blog/:id", async (req, res) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id);
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(404).json({ message: "Blog not found" });
  }
});

// PUT update blog
router.put(
  "/update-blog/:id",
  upload.fields([{ name: "images" }, { name: "videos" }]),
  async (req, res) => {
    try {
      const updateData = req.body;
      if (req.files.images) {
        updateData.images = req.files.images.map((file) => file.path);
      }

      if (req.files.videos) {
        updateData.videos = req.files.videos.map((file) => file.path);
      }

      const updatedBlog = await BlogService.updateBlog(
        req.params.id,
        updateData
      );
      res.json({ message: "Blog updated successfully.", blog: updatedBlog });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(404).json({ message: "Blog not found." });
    }
  }
);

// GET blogs by user
router.get("/get-doctor-blogs", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const blogs = await BlogService.getBlogsByUserId(userId);
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE blog
router.delete("/delete-blog/:id", async (req, res) => {
  try {
    await BlogService.deleteBlog(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(404).json({ message: "Blog not found." });
  }
});

// GET blog count by user ID
router.get("/blog-count", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const blogCount = await BlogService.countBlogsByUserId(clerkUserId);
    return res.status(200).json(blogCount);
  } catch (error) {
    console.error("Error fetching blog count:", error);
    return res.status(500).json({ error: "Failed to fetch blog count" });
  }
});

module.exports = router;

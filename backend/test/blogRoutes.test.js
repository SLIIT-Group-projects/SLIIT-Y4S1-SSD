const request = require("supertest");
const app = require("../server"); // Import the Express app
const Blog = require("../models/blog"); // Adjust the path as needed for your Blog model

// Set up the auth token to be passed manually
const authToken =
  "Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18ybkNIZFhoSXRmMXlxTVFKU3NaTHFvZ05YaEkiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3Mjk0MjU2MDAsImlhdCI6MTcyOTQyNTU0MCwiaXNzIjoiaHR0cHM6Ly9jYXVzYWwtYm94ZXItOTAuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzI5NDI1NTMwLCJzaWQiOiJzZXNzXzJuY1g0TnVNRUdndDUzMjFvRm9ONGI1dGZOMiIsInN1YiI6InVzZXJfMm5DS1ljOGtYQkpWSGRUa3ljVHUzd21xMFQ1In0.LdvcIggpRZi9TjgvuOhfI3N6_NpJEqhCMm2qXAVwuOwLDHAKOqsdCnMIN0UxRHaFIarGNitnmFgQvNRFzzRHUaV1svZuU8qD_CIg-0FKiclYreimOp2wmQuISqrVSa3Oyn7PX-BBYN0hVbKB4HE6xwUpoZOm--w0H6R5YQRgHtYbnduuYn-jkfsvmGIjtFmEyAJTSzGkbsF88nDLyU4npXY1QFe87bXlBFCII0mryr51XYgg1u6KIrGX2Cfvr55V5oVIqu41JWtwX9z3HJ9Ymlz9eXozozjEEjUP3bmPbstGpIcZ7JGHbHSHzz-aoEmepgP9AxAXqlQb6z48WXepoA"; // Replace with your actual token

// Describe the Blog API test suite
describe("Blog API", () => {
  // Before running the tests, clear the database and add some initial blog data
  beforeAll(async () => {
    await Blog.deleteMany({});
    await Blog.create([
      {
        clerkUserId: "test_user_1",
        title: "First Blog",
        introduction: "Introduction of the first blog",
        symptoms: "Some symptoms",
        causes: "Some causes",
        prevention: "Some prevention",
        treatment: "Some treatment",
        caseStudy: "Some case study",
        callToAction: "Call to action",
        references: "Some references",
        relatedLinks: "Some related links",
        disclaimer: "Some disclaimer",
      },
      {
        clerkUserId: "test_user_2",
        title: "Second Blog",
        introduction: "Introduction of the second blog",
        symptoms: "Some symptoms",
        causes: "Some causes",
        prevention: "Some prevention",
        treatment: "Some treatment",
        caseStudy: "Some case study",
        callToAction: "Call to action",
        references: "Some references",
        relatedLinks: "Some related links",
        disclaimer: "Some disclaimer",
      },
    ]);
  });

  // Clean up after the tests by removing all blogs
  afterAll(async () => {
    await Blog.deleteMany({});
  });

  // Test the GET /get-blogs route
  describe("GET /get-blogs", () => {
    it("should return all blogs", async () => {
      const res = await request(app)
        .get("/blog/get-blogs")
        .set("Authorization", authToken);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("title", "First Blog");
      expect(res.body[1]).toHaveProperty("title", "Second Blog");
    });
  });

  // Test the POST /blog/create-blog route

  // Test the DELETE /delete-blog/:id route
  describe("DELETE /delete-blog/:id", () => {
    it("should delete a blog by ID", async () => {
      const blogToDelete = await Blog.findOne({ title: "First Blog" });

      const res = await request(app)
        .delete(`/blog/delete-blog/${blogToDelete._id}`)
        .set("Authorization", authToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Blog deleted successfully.");

      // Check that the blog no longer exists
      const deletedBlog = await Blog.findById(blogToDelete._id);
      expect(deletedBlog).toBeNull();
    });

    it("should return 404 if the blog is not found", async () => {
      const fakeId = "613a5dfc3561b83bb4b2e4b5"; // A non-existent ID

      const res = await request(app)
        .delete(`/blog/delete-blog/${fakeId}`)
        .set("Authorization", authToken);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Blog not found.");
    });
  });
});

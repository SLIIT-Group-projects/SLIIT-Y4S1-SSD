const { uploadReport } = require("../controllers/labReportController");
const { updateReport } = require("../controllers/labReportController");
const LabReport = require("../models/labReport");
const User = require("../models/user");
const httpMocks = require("node-mocks-http");

// Mock the LabReport and User models
jest.mock("../models/LabReport");
jest.mock("../models/User");

describe("Lab Report Controller - Create Lab Report", () => {
  it("should return 404 if the user is not found", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/reports/upload",
      body: {
        reportID: "report_123",
        clerkUserId: "user_invalid",
        comment: "Sample comment",
        doctorName: "Dr. John Doe",
      },
      file: {
        path: "uploads/test.pdf",
        size: 1234,
        mimetype: "application/pdf",
      },
    });

    const res = httpMocks.createResponse();

    // Mock user not found
    User.findOne.mockResolvedValue(null);

    // Call the controller function
    await uploadReport(req, res);

    const responseData = JSON.parse(res._getData());

    // Check response status and message
    expect(res.statusCode).toBe(404); // Expecting 404 for user not found
    expect(responseData).toEqual({ message: "User not found" });
  });
});
describe("Lab Report Controller - Update Lab Report", () => {
  it("should update an existing lab report and return success message", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/api/reports/123",
      params: { id: "report_id_123" },
      body: {
        reportID: "report_123",
        clerkUserId: "user_abc",
        comment: "Updated comment",
        doctorName: "Dr. John Doe",
      },
      file: {
        path: "uploads/new_test.pdf",
        size: 12345,
        mimetype: "application/pdf",
      },
    });

    const res = httpMocks.createResponse();

    // Mock existing report
    LabReport.findById.mockResolvedValue({
      _id: "report_id_123",
      reportID: "report_123",
      userId: "user_id_123",
      fileUrl: "uploads/test.pdf",
      fileSize: 1234,
      fileType: "application/pdf",
      doctorComments: [
        { doctorName: "Dr. John Doe", comment: "Sample comment" },
      ],
      save: jest.fn().mockResolvedValue({
        reportID: "report_123",
        clerkUserId: "user_abc",
        fileUrl: "uploads/new_test.pdf",
        fileSize: 12345,
        fileType: "application/pdf",
        doctorComments: [
          { doctorName: "Dr. John Doe", comment: "Updated comment" },
        ],
      }),
    });

    // Call the controller function
    await updateReport(req, res);

    const responseData = JSON.parse(res._getData());

    // Check response status and message
    expect(res.statusCode).toBe(200); // Expecting 200 for update
    expect(responseData).toEqual({
      message: "Lab report updated successfully",
      updatedReport: {
        reportID: "report_123",
        clerkUserId: "user_abc",
        fileUrl: "uploads/new_test.pdf",
        fileSize: 12345,
        fileType: "application/pdf",
        doctorComments: [
          { doctorName: "Dr. John Doe", comment: "Updated comment" },
        ],
      },
    });
  });

  it("should return 404 if the lab report is not found", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      url: "/api/reports/123",
      params: { id: "invalid_report_id" },
    });

    const res = httpMocks.createResponse();

    // Mock report not found
    LabReport.findById.mockResolvedValue(null);

    // Call the controller function
    await updateReport(req, res);

    const responseData = JSON.parse(res._getData());

    // Check response status and message
    expect(res.statusCode).toBe(404); // Expecting 404 for report not found
    expect(responseData).toEqual({ message: "Lab report not found" });
  });
});

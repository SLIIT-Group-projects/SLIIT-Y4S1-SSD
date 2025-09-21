const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const Appointment = require("../models/appointment");
const AppointmentFactory = require("../factory/AppointmentFactory");

const router = express.Router();

// POST request to create a new doctor
router.post(
  "/create-appointment",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const clerkUserId = req.auth.userId;
    try {
      // Use the factory to create a new appointment
      const newAppointment = AppointmentFactory.createAppointment({
        ...req.body,
        clerkUserId, // Add clerkUserId to the data
      });

      // Save the new Appointment to the database
      await newAppointment.save();

      res.status(201).json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// // get appointments according to the doctor
router.get(
  "/get-doctor-appointments",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const clerkUserId = req.auth.userId; 

    try {
      // Get today's date in UTC
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Set to the next day

      // Filter appointments based on the current user's clerkUserId, status "Pending", and today's date
      const filter = {
        doc_id: clerkUserId, // Match doc_id with the current user's ID
        status: "Pending", 
        appointment_date: { $gte: today, $lt: tomorrow }, // Match today's date
      };

      // Find all matching appointments
      const appointments = await Appointment.find(filter);

      // Check if there are no matching appointments
      if (!appointments || appointments.length === 0) {
        return res
          .status(404)
          .json({ message: "No pending appointments for today." });
      }

      // Return the list of appointments found
      res.status(200).json({
        message: "Today's pending appointments retrieved successfully.",
        appointments,
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);



// fetch patient rows
  router.get("/get-patient-appointments", ClerkExpressRequireAuth(), async (req, res) => {
    const clerkUserId = req.auth.userId; // Get the current user's clerkUserId
    
    try {
      // Find all appointments that match the current user's clerkUserId
      const appointments = await Appointment.find({ clerkUserId });
  
      // Check if there are no matching appointments
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: "No appointments found" });
      }
  
      // Return the list of appointments found
      res.status(200).json({
        message: "Appointments retrieved successfully",
        appointments
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Fetch all appointments
router.get("/get-all-appointments", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // Find all appointments in the database
    const appointments = await Appointment.find();

    // Check if there are no appointments
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    // Return the list of appointments found
    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  
// update status of the request
router.route("/appointment-update/:id").put(async (req, res) => {
    const appointmentId = req.params.id; // Use appointmentId instead of yieldId for clarity

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).send({ status: "Appointment not found" });
        }

        // Update the appointment status to "completed"
        appointment.status = "Completed";

        // Save the updated appointment
        const updatedAppointment = await appointment.save();

        res.status(200).send({ status: "Appointment status updated to completed", appointment: updatedAppointment });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "Error updating appointment status", error: err.message });
    }
});

// delete appointment
// Route for deleting an appointment
// Route to delete an appointment
router.delete("/delete-appointment/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const appointmentId = req.params.id;

  try {
      // Fetch the appointment by ID
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
          return res.status(404).json({ message: "Appointment not found" });
      }

      // Proceed with deletion
      await Appointment.findByIdAndDelete(appointmentId);
      res.status(200).json({ message: "Appointment deleted successfully" });

  } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;

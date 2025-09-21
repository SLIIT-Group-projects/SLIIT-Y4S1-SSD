const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  patient_name: { type: String, required: true },
  patient_email: { type: String, required: true },
  age: { type: Number, required: true },
  doctor_name: { type: String, required: true },
  doc_id: { type: String },
  day: { type: String, required: true },
  slot: { type: String, required: true },
  appointment_date: { type: Date, required: true },            
  note: { type: String, required: true },
  current_date: { type: Date, required: true }, 
  status: { type: String, required: true },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);

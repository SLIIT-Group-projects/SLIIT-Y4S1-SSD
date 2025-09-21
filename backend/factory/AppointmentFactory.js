// factories/appointmentFactory.js
const Appointment = require("../models/appointment");

class AppointmentFactory {
  static createAppointment(data) {
    const {
      clerkUserId,
      patient_name,
      patient_email,
      age,
      doctor_name,
      doc_id,
      day,
      slot,
      appointment_date,
      note,
      status,
    } = data;

    const newAppointment = new Appointment({
      clerkUserId,
      patient_name,
      patient_email,
      age,
      doctor_name,
      doc_id,
      day,
      slot,
      appointment_date,
      note,
      current_date: new Date(),
      status,
    });

    return newAppointment;
  }
}

module.exports = AppointmentFactory;

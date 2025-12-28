// Import all schemas
import Appointment from "./Appointment.model.js";
import AppointmentHeader from "./AppointmentHeader.model.js";
import AppointmentLines from "./AppointmentLines.model.js";
import Doctor from "./Doctor.model.js";
import Patient from "./Patient.model.js";
import PaymentMethod from "./PaymentMethod.model.js";
import Role from "./Role.model.js";
import Services from "./Services.model.js";
import Status from "./Status.model.js";
import User from "./User.model.js";

// Export them together
export {
  Appointment,
  AppointmentHeader,
  AppointmentLines,
  Doctor,
  Patient,
  PaymentMethod,
  Role,
  Services,
  Status,
  User
};
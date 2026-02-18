import nodemailer from "nodemailer";

export async function sendEmail(appointment) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CLINIC_EMAIL,
      pass: process.env.CLINIC_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.CLINIC_EMAIL,
    to: process.env.CLINIC_EMAIL,
    subject: "🦷 New Appointment Booking",
    text: `
New Appointment Request:

Name: ${appointment.name}
Phone: ${appointment.phone}
Service: ${appointment.service}
Date: ${appointment.date}
Time: ${appointment.time}
    `,
  });
}

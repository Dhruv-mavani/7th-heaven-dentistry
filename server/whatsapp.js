import twilio from "twilio";

export async function sendWhatsApp(appointment) {
  const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
  );

  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
    to: `whatsapp:${process.env.CLINIC_PHONE}`,
    body: `🦷 New Appointment!

Name: ${appointment.name}
Service: ${appointment.service}
Date: ${appointment.date}
Time: ${appointment.time}
Phone: ${appointment.phone}`,
  });
}

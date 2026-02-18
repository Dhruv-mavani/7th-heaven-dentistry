import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendEmail } from "./email.js";
import { sendWhatsApp } from "./whatsapp.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dental Clinic Backend Running ✅");
});

app.post("/api/appointments", async (req, res) => {
  const appointment = req.body;

  await sendEmail(appointment);

  res.json({
    success: true,
    message: "Appointment request sent successfully!",
  });
});


app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);

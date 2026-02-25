import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendEmail } from "./email.js";
import { sendWhatsApp } from "./whatsapp.js";


dotenv.config();
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dental Clinic Backend Running ✅");
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        { name, phone, message }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to save message" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/appointments", async (req, res) => {
  try {
    const { name, phone, service, date, time } = req.body;

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        { service, date, time, name, phone }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to save appointment" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// In your server index.js
app.patch('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { is_completed } = req.body;

  const { data, error } = await supabase
    .from('appointments')
    .update({ is_completed })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Status updated", data });
});



app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);

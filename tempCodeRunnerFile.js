const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");
const Report = require("./model/report"); // NEW MODEL
const Contact = require("./model/contact"); // NEW

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 1500;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/safepulse")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "snehamv23@gmail.com",
    pass: "uabinlszelimorjr",
  },
});

async function sendReportEmail(toEmails, message) {
  const mailOptions = {
    from: '"SafePulse" <alert@safepulse.com>',
    to: toEmails,
    subject: "⚠️ Suspicious Activity Report",
    text: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✉️ Report email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Report email failed:", error);
    return false;
  }
}

// === Suspicious activity report endpoint ===
app.post("/api/report", async (req, res) => {
  const { activity, location, lat, lng } = req.body;
  if (!activity || !location || typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const report = new Report({
    activity,
    location,
    lat,
    lng,
    timestamp: new Date()
  });

  await report.save();

  const emailMsg = `Suspicious Activity Report:\n\nActivity: ${activity}\nLocation: ${location}\nCoordinates: ${lat}, ${lng}\nTime: ${report.timestamp}`;
  const emailSent = await sendReportEmail(["hrejulsekhar@gmail.com"], emailMsg);

  if (!emailSent) return res.status(500).json({ error: "Failed to send report email" });

  res.json({ message: "Report received and emailed to authorities" });
});

// === Location threat level ===
app.post("/api/location-threat", async (req, res) => {
  const { lat, lng } = req.body;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  const reports = await Report.find();
  const count = reports.filter(r => getDistance(lat, lng, r.lat, r.lng) <= 2).length;

  let level = "Safe";
  if (count >= 10) level = "Critical";
  else if (count >= 5) level = "High";
  else if (count >= 2) level = "Moderate";

  res.json({ level, count });
});

// === Get all danger zones ===
app.get("/api/danger-zones", async (req, res) => {
  const allReports = await Report.find();
  const heatmap = {};

  allReports.forEach(({ lat, lng }) => {
    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    heatmap[key] = (heatmap[key] || 0) + 1;
  });

  const zones = Object.entries(heatmap)
    .filter(([_, count]) => count >= 5)
    .map(([key, count]) => {
      const [lat, lng] = key.split(',').map(Number);
      return { lat, lng, count };
    });

  res.json(zones);
});

// === Emergency alert endpoint ===
app.post("/api/emergency", async (req, res) => {
  const { message, timestamp, lat, lng } = req.body;
  if (!message || !timestamp || typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  console.log("🚨 Emergency alert received:", message, lat, lng, timestamp);

  // Find clients within 1 km
  const nearbyClients = [];
  connectedClients.forEach(({ lat: clientLat, lng: clientLng }, socketId) => {
    const dist = getDistance(lat, lng, clientLat, clientLng);
    if (dist <= 1) {
      nearbyClients.push(socketId);
    }
  });

  // Emit alert to those clients
  nearbyClients.forEach(socketId => {
    io.to(socketId).emit("emergency-alert", { message, timestamp, lat, lng });
  });

  console.log(`Broadcasted emergency alert to ${nearbyClients.length} clients`);

  res.json({ message: "Emergency alert broadcasted", count: nearbyClients.length });
});

// === Get all contacts ===
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// === Add a new contact ===
app.post("/api/contacts", async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
  }

  try {
    const newContact = new Contact({ name, number });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact" });
  }
});

const connectedClients = new Map(); // socket.id => { lat, lng }

// When a client connects
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client sends their current location after connecting
  socket.on("registerLocation", ({ lat, lng }) => {
    connectedClients.set(socket.id, { lat, lng });
    console.log(`Location registered for ${socket.id}:`, lat, lng);
  });

  // Remove client on disconnect
  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

// === Distance utils ===
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});

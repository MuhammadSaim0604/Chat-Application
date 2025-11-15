import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


let pingScheduled = false;

app.get('/ping', (req, res) => {
  const targetUrl = 'https://muhammad-saim-portfolio.onrender.com/ping';

  if (pingScheduled) {
    return res.send('Ping already scheduled or sent.');
  }

  pingScheduled = true;

  setTimeout(() => {
    fetch(targetUrl, { method: 'GET' })
      .then(response => console.log(`Pinged ${targetUrl} - status ${response.status}`))
      .catch(err => console.log('Error pinging target:', err.message));
  }, 30 * 1000);

  res.send('Ping scheduled to run in 30 seconds.');
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});

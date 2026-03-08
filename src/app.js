const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const imageUploadRoutes = require("./routes/imageupuloadRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5173",
      "https://glowly-frontend-react.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/hello", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api", imageUploadRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", reviewRoutes);
app.use("/api", orderRoutes);
app.use("/api", subscribeRoutes);

module.exports = app;

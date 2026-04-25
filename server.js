require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3012;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const staticRoutes = require("./routes/staticRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const awardRoutes = require("./routes/awardRoutes");
const testimonialRoutes = require('./routes/testimonialRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const directorRoutes = require('./routes/directorRoutes');
const companyRoutes = require('./routes/companyRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const blogRoutes = require('./routes/blogRoutes');

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3011",
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Assets
app.use("/OnlineImages", express.static(path.join(__dirname, "uploads", "OnlineImages")));
app.use("/assets", express.static(path.join(__dirname, "uploads", "assets")));

// Modular Routes
app.use("/api/auth", authRoutes);
app.use("/api/page", staticRoutes);
app.use("/api/contact", contactUsRoutes);
app.use("/api/award", awardRoutes);
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/director', directorRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/milestone', milestoneRoutes);
app.use('/api/blog', blogRoutes);


app.listen(PORT, (err) => {
  if (err) {
    console.error(" Failed to start server:", err);
  } else {
    console.log(` Server running at http://localhost:${PORT}`);
  }
});
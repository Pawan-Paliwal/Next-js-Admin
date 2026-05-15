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
const partnerLogoRoutes = require('./routes/partnerLogoRoutes');
const manufacturingRoutes = require('./routes/manufacturingRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const careerRoutes = require('./routes/careerRoutes');
const whatsNewRoutes = require('./routes/whatsNewRoutes');
const facilityCategoryRoutes = require('./routes/facilityCategoryRoutes');
const facilityProductRoutes = require('./routes/facilityProductRoutes');
const clientTypeRoutes = require('./routes/clientTypeRoutes');
const clientLogoMappingRoutes = require('./routes/clientLogoMappingRoutes');


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
app.use('/api/partnerlogo', partnerLogoRoutes);
app.use('/api/manufacturing', manufacturingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/whatsnew', whatsNewRoutes);
app.use('/api/facilitycategory', facilityCategoryRoutes);
app.use('/api/facilityproduct', facilityProductRoutes);
app.use('/api/clienttype', clientTypeRoutes);
app.use('/api/clientlogomapping', clientLogoMappingRoutes);



app.listen(PORT, (err) => {
  if (err) {
    console.error(" Failed to start server:", err);
  } else {
    console.log(` Server running at http://localhost:${PORT}`);
  }
});
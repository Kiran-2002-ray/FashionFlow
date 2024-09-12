
const express = require("express");
const path = require("path");
require('dotenv').config();
const cors = require("cors");
const connectDB = require("./conn");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const verifyToken = require("./middleware/verifyToken");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Use PORT for server port from environment variable, default to 3030
const port =  3030;

connectDB();

// Uncomment CORS configuration if needed
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
//   })
// );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/verifyhome", verifyToken, (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  res.sendFile(filePath); // Adjust path if needed
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/contact", contactRoutes);

app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "public", "index.html");
  res.sendFile(filePath); // Serve the SPA entry point for client-side routing
});

// Start the server on the correct port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// frontend/src/config.js

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://hms-backend-jfjd.onrender.com/api"
    : "http://localhost:4000/api";

export default API_BASE;

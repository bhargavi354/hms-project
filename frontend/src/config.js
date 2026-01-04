// frontend/src/config.js

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "https://hms-backend-jfjd.onrender.com/api";

export default API_BASE;

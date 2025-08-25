import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";        // Main App component
// import reportWebVitals from "./reportWebVitals"; // Optional: for performance measuring
import './index.css';  // Tailwind styles included

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
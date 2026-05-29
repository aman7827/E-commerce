/**
 * main.jsx
 * Purpose: React application entry point.
 * Mounts the App component into the #root div in index.html.
 * Wraps the app in StrictMode for catching potential issues during development.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* HelmetProvider enables React Helmet to work throughout the app */}
    {/* Every page can set its own <title> and <meta> tags via <Helmet> */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

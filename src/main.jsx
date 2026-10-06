import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import "./refine.css";
import "./premium.css";
import "./live.css";
import "./combo.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter><App /></BrowserRouter>
);

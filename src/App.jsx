// src/App.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter /* or HashRouter for IIS */ } from "react-router-dom";

// adjust paths as needed
import Navbar from "./Recruitment/Navbar.jsx";   // avoid spaces in folder names
import ApplicantMasterData from "./Recruitment/ApplicantMasterData.jsx";
import "./index.css";

function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-gray-100 ">
      <Navbar />
      <div className="mx-auto w-full max-w-[1500px] px-3 md:px-6 py-4">
        <ApplicantMasterData />
      </div>
    </div>
  );
}

// === BOOTSTRAP HERE (no separate main.jsx) ===
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

// (Optional) also export if you want to import AppShell elsewhere
export default AppShell;

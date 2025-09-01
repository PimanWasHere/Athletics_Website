import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import CommunityPage from "./pages/CommunityPage";
import MembershipPage from "./pages/MembershipPage";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/membership" element={<MembershipPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
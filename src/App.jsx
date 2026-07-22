import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Layout/Navbar"
import Footer from "./components/Layout/Footer"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import FeaturesPage from "./pages/FeaturesPage"
import PricingPage from "./pages/PricingPage"
import LoginPage from "./pages/LoginPage"
import WorkoutPage from "./pages/WorkoutPage"
import DashboardPage from "./pages/DashboardPage"

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/workout" element={<WorkoutPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";

import Login from "./pages/auth/Login";
import SignUP from "./pages/auth/SignUP";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/income"; 
import Expense from "./pages/Dashboard/Expense";
import DashboardLayout from "./components/layouts/DashboardLayout";

// 1. Optimized Protected Route
// We move DashboardLayout INSIDE here to keep the route definitions clean and stable
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  
  if (!isAuthenticated) {
    // 'replace' is critical to prevent history loops
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUP />} />

          {/* Protected Routes - Notice the cleaner nesting */}
          <Route 
    path="/dashboard" 
    element={<ProtectedRoute key="dashboard-page"><Home /></ProtectedRoute>} 
  />
  <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
  <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />

          {/* Root & Fallback Redirects */}
          <Route path="/" element={<Root />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      {/* Moved Toaster outside Router for better performance */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </UserContextProvider>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
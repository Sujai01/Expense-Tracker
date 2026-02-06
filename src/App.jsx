import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/userContext";

import Login from "./pages/auth/Login";
import SignUP from "./pages/auth/SignUP";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/income"; 
import Expense from "./pages/Dashboard/Expense";
import DashboardLayout from "./components/layouts/DashboardLayout";

// This component checks auth and then renders the "Outlet" (the sub-page)
const AuthGuard = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  
  // Wrap the Outlet in the Layout so the Layout stays stable
  return (
    <DashboardLayout>
      <Outlet /> 
    </DashboardLayout>
  );
};

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUP />} />

          {/* Protected Routes - Notice how they are INSIDE AuthGuard */}
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </UserContextProvider>
  );
};

export default App;
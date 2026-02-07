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

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUP />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Home /></DashboardLayout></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><DashboardLayout><Income /></DashboardLayout></ProtectedRoute>} />
          <Route path="/expense" element={<ProtectedRoute><DashboardLayout><Expense /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </UserContextProvider>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
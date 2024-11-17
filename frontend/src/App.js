import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Components/NavBar/NavBar";
import Login from "./Pages/Login/Login";
import CollaboratorList from "./Components/Colaborador/ColaboradorList";
import WorkshopList from "./Components/Workshop/WorkshopList";
import WorkshopDetails from "./Components/Workshop/WorkshopDetails";
import ProtectedRoute from "./Components/Route/ProtectedRoute";
import Dashboard from "./Pages/Dashboard/Dashboard"; // Import your dashboard component

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collaborators"
          element={
            <ProtectedRoute>
              <CollaboratorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <ProtectedRoute>
              <WorkshopList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workshops/:id"
          element={
            <ProtectedRoute>
              <WorkshopDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

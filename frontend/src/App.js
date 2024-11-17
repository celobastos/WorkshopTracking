import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar/NavBar";
import Login from "./Pages/Login/Login";
import CollaboratorList from "./Components/Colaborador/ColaboradorList";
import WorkshopList from "./Components/Workshop/WorkshopList";
import WorkshopDetails from "./Components/Workshop/WorkshopDetails";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/collaborators" element={<CollaboratorList />} />
        <Route path="/workshops" element={<WorkshopList />} />
        <Route path="/workshops/:id" element={<WorkshopDetails />} />
      </Routes>
    </Router>
  );
};

export default App;

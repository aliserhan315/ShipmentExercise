import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AllShipments from "./pages/AllShipments/AllShipments";
import CreateShipment from "./pages/CreateShipment/CreateShipment";
import EditShipment from "./pages/EditShipment/EditShipment";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/shipments" element={<AllShipments />} />
      <Route path="/shipments/new" element={<CreateShipment />} />
      <Route path="/shipments/:id/edit" element={<EditShipment />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-box">
        {/* will add one later */}
        </div>
        <span className="sidebar-title">Shipment Daily</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " sidebar-link-active" : "")
          }
        >
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/shipments"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " sidebar-link-active" : "")
          }
        >
          <span>All Shipments</span>
        </NavLink>

        <NavLink
          to="/shipments/new"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " sidebar-link-active" : "")
          }
        >
          <span className="sidebar-icon">＋</span>
          <span>Create Shipment</span>
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

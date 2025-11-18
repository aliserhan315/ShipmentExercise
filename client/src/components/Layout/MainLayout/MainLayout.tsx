import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import "./MainLayout.css";

type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="layout-root">
      <Sidebar />
      <main className="layout-main">
        <div className="layout-main-inner">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;

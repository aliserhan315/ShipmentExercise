import React, { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout/MainLayout";
import { ShipmentAPI } from "../../api/queries";
import "./Dashboard.css";

interface Shipment {
  id: number;
  waybill: string;
  customerName: string;
  status: "CREATED" | "IN_TRANSIT" | "DELIVERED" | "CANCELED";
}

const Dashboard: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await ShipmentAPI.list();
        setShipments(data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const total = shipments.length;
  const inTransit = shipments.filter((s) => s.status === "IN_TRANSIT").length;
  const delivered = shipments.filter((s) => s.status === "DELIVERED").length;
  const canceled = shipments.filter((s) => s.status === "CANCELED").length;
  const recent = shipments.slice(0, 3);

  return (
    <MainLayout>
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-row">
        <div className="stat-card stat-blue">
          <span className="stat-label">Total Shipments</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card stat-amber">
          <span className="stat-label">In Transit</span>
          <span className="stat-value">{inTransit}</span>
        </div>
        <div className="stat-card stat-green">
          <span className="stat-label">Delivered</span>
          <span className="stat-value">{delivered}</span>
        </div>
        <div className="stat-card stat-red">
          <span className="stat-label">Canceled</span>
          <span className="stat-value">{canceled}</span>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Recent Shipments</h2>
        <div className="recent-list">
          {recent.map((s) => (
            <div key={s.id} className="recent-item">
              <div>
                <div className="recent-waybill">{s.waybill}</div>
                <div className="recent-name">{s.customerName}</div>
              </div>
              <span className={`recent-status recent-${s.status}`}>
                {s.status}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <p className="empty-text">No shipments yet.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

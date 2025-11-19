import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout/MainLayout";
import ShipmentCard from "../../components/Shipments/ShipmentCard";
import { ShipmentAPI } from "../../api/queries";
import "./AllShipments.css";

interface WeatherSnapshot {
  tempC?: number;
  condition?: string;
  icon?: string;
  locationName?: string;
  country?: string;
  raw?: any;
}

interface Shipment {
  id: number;
  waybill: string;
  customerName: string;
  customerPhone: string;
  city: string;
  country: string;
  street: string;
  building: string;
  status: "CREATED" | "IN_TRANSIT" | "DELIVERED" | "CANCELED";
  weatherSnapshot?: WeatherSnapshot | null;
}

const AllShipments: React.FC = () => {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await ShipmentAPI.list();
      setShipments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = shipments.filter((s) => {
    const q = search.toLowerCase();
    const fullAddress = `${s.street || ""}, ${s.building || ""}, ${
      s.city || ""
    }, ${s.country || ""}`;

    return (
      s.waybill?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      fullAddress.toLowerCase().includes(q)
    );
  });

  const handleProgressStatus = async (shipment: Shipment) => {
    const statusProgression: Record<Shipment["status"], Shipment["status"]> = {
      CREATED: "IN_TRANSIT",
      IN_TRANSIT: "DELIVERED",
      DELIVERED: "DELIVERED",
      CANCELED: "CANCELED",
    };

    const nextStatus = statusProgression[shipment.status];

    if (nextStatus === shipment.status) {
      return;
    }

    try {
      await ShipmentAPI.update(shipment.id, { status: nextStatus });
      setShipments((prev) =>
        prev.map((x) =>
          x.id === shipment.id ? { ...x, status: nextStatus } : x
        )
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update shipment status");
    }
  };

  const handleCancel = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to cancel this shipment?")) {
      return;
    }

    try {
      await ShipmentAPI.cancel(id);
      setShipments((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "CANCELED" } : x))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to cancel shipment");
    }
  };

  return (
    <MainLayout>
      <div className="page-header">
        <h1 className="page-title">All Shipments</h1>
        <button
          className="primary-button"
          onClick={() => navigate("/shipments/new")}
        >
          ＋ New Shipment
        </button>
      </div>

      <div className="search-box-wrapper">
        <input
          className="search-input"
          placeholder="Search by waybill, customer name, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading shipments...</p>
        </div>
      ) : (
        <div className="shipments-grid">
          {filtered.map((s) => {
            const customerAddress = `${s.street}, ${s.building}, ${s.city}, ${s.country}`;

            const snapshot: any = s.weatherSnapshot;

            const temp =
              snapshot?.tempC ??
              snapshot?.temp_c ??
              snapshot?.current?.temp_c;

            const condition =
              snapshot?.condition ??
              snapshot?.condition?.text ??
              snapshot?.current?.condition?.text;

            const weatherSummary =
              temp != null || condition
                ? `${temp != null ? `${temp}°C` : ""} ${condition ?? ""}`.trim()
                : undefined;

            return (
              <ShipmentCard
                key={s.id}
                waybill={s.waybill}
                customerName={s.customerName}
                customerPhone={s.customerPhone}
                customerAddress={customerAddress}
                status={s.status}
                weatherSummary={weatherSummary}
                onEdit={() => navigate(`/shipments/${s.id}/edit`)}
                onCancel={() => handleCancel(s.id)}
                onProgress={() => handleProgressStatus(s)}
              />
            );
          })}
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p className="empty-text">No shipments found</p>
              <p className="empty-subtext">
                {search
                  ? "Try adjusting your search"
                  : "Create your first shipment to get started"}
              </p>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default AllShipments;

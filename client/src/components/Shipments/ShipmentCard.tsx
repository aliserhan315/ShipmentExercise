import React from "react";
import "./ShipmentCard.css";

interface ShipmentCardProps {
  waybill: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: "CREATED" | "IN_TRANSIT" | "DELIVERED" | "CANCELED";
  weatherSummary?: string;
  onEdit: () => void;
  onCancel: () => void;
  onProgress?: () => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({
  waybill,
  customerName,
  customerPhone,
  customerAddress,
  status,
  weatherSummary,
  onEdit,
  onCancel,
  onProgress,
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case "CREATED":
        return { text: "Created", class: "status-created" };
      case "IN_TRANSIT":
        return { text: "In Transit", class: "status-transit" };
      case "DELIVERED":
        return { text: "Delivered", class: "status-delivered" };
      case "CANCELED":
        return { text: "Canceled", class: "status-canceled" };
      default:
        return { text: status, class: "" };
    }
  };

  const getNextStatusText = () => {
    switch (status) {
      case "CREATED":
        return "Start Transit";
      case "IN_TRANSIT":
        return "Mark Delivered";
      case "DELIVERED":
        return null;
      case "CANCELED":
        return null;
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();
  const nextStatusText = getNextStatusText();
  const canProgress = nextStatusText !== null;

  return (
    <div className="shipment-card">
      <div className="card-header">
        <div className="waybill-badge">{waybill}</div>
        <span className={`status-badge ${statusDisplay.class}`}>
          {statusDisplay.text}
        </span>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Customer</span>
          <span className="info-value">{customerName}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Phone</span>
          <span className="info-value">{customerPhone}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Address</span>
          <span className="info-value">{customerAddress}</span>
        </div>

        {weatherSummary && (
          <div className="weather-badge">
            <span className="weather-icon">☁</span>
            <span className="weather-text">{weatherSummary}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {canProgress && onProgress && (
          <button className="btn-progress" onClick={onProgress}>
            {nextStatusText}
          </button>
        )}
        {status !== "CANCELED" && status !== "DELIVERED" && (
          <>
            <button className="btn-edit" onClick={onEdit}>
              Edit
            </button>
            <button className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShipmentCard;
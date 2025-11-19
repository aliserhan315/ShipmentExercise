import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout/MainLayout";
import Input from "../../components/Input/Input";
import "./EditShipment.css";
import { ShipmentAPI } from "../../api/queries";

const EditShipment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [waybill, setWaybill] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadShipment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadShipment = async () => {
    try {
      setFetchingData(true);
      const data = await ShipmentAPI.get(id!);
      
      setWaybill(data.waybill || "");
      setCustomerName(data.customerName || "");
      setCustomerPhone(data.customerPhone || "");
      setStatus(data.status || "CREATED");
      
      // Parse address if it exists
      const address = data.customerAddress || "";
      const parts = address.split(", ");
      if (parts.length >= 4) {
        setStreet(parts[0] || "");
        setBuilding(parts[1] || "");
        setCity(parts[2] || "");
        setCountry(parts[3] || "");
      } else if (parts.length === 2) {
        setCity(parts[0] || "");
        setCountry(parts[1] || "");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load shipment.";
      setError(msg);
      console.error(err);
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!waybill || !customerName || !customerPhone || !city || !country) {
      setError("Waybill, customer name, phone, city and country are required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        waybill,
        customerName,
        customerPhone,
        street,
        building,
        city,
        country,
        status,
      };

      await ShipmentAPI.update(id!, payload);

      setSuccessMsg("Shipment updated successfully.");
      setTimeout(() => navigate("/shipments"), 800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to update shipment. Please try again.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <MainLayout>
        <div className="loading-container">
          <p>Loading shipment data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="page-title">Edit Shipment</h1>

      <div className="edit-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="section-label">Customer Name</label>
            <Input
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Phone Number</label>
            <Input
              placeholder="+1234567890"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Waybill</label>
            <Input
              placeholder="e.g. WB001234"
              value={waybill}
              onChange={(e) => setWaybill(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label className="section-label">Status</label>
            <select
              className="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="CREATED">Created</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          <div className="form-section">
            <label className="section-label">Delivery Address</label>

            <div className="address-grid">
              <Input
                label="Street"
                placeholder="Street name"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <Input
                label="Building"
                placeholder="Building / Apartment"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </div>

            <div className="address-grid">
              <Input
                label="City"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="Country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          {successMsg && <p className="form-success">{successMsg}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/shipments")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Shipment"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditShipment;
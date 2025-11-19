import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout/MainLayout";
import Input from "../../components/Input/Input";
import "./CreateShipment.css";
import { ShipmentAPI } from "../../api/queries";

const CreateShipment: React.FC = () => {
  const navigate = useNavigate();

  const [waybill, setWaybill] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      };

      await ShipmentAPI.create(payload);

      setSuccessMsg("Shipment created successfully.");
      setTimeout(() => navigate("/shipments"), 800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to create shipment. Please try again.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="page-title">Create New Shipment</h1>

      <div className="create-card">
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
            <p className="helper-text">
              We&apos;ll use this to contact the customer if needed.
            </p>
          </div>

          <div className="form-section">
            <label className="section-label">Waybill</label>
            <Input
              placeholder="e.g. WB001234"
              value={waybill}
              onChange={(e) => setWaybill(e.target.value)}
            />
            <p className="helper-text">
              Waybill must be unique for each shipment.
            </p>
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

            <p className="helper-text">
              We will combine street, building, city and country into a full
              delivery address for this shipment.
            </p>
          </div>

          <div className="weather-box">
            <div className="weather-title-row">
              <span className="weather-icon">☁</span>
              <span className="weather-title">Weather at Destination</span>
            </div>
            {city && country ? (
              <p className="weather-text">
                When you create this shipment, we&apos;ll fetch the current
                weather for <strong>{city}</strong>, <strong>{country}</strong>{" "}
                using WeatherAPI and store it with the shipment.
              </p>
            ) : (
              <p className="weather-text">
                Enter a city and country to link destination weather data to
                this shipment.
              </p>
            )}
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
              {loading ? "Creating..." : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateShipment;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { AuthAPI } from "../../api/queries";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [location, setLocation]   = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const out = await AuthAPI.register({
        firstName,
        lastName,
        email,
        password,
        phone,
        location,
      });

      localStorage.setItem("accessToken", out.accessToken);
      localStorage.setItem("refreshToken", out.refreshToken);
      localStorage.setItem("user", JSON.stringify(out.user));

      navigate("/dashboard");
    } catch (err: any) {
    if ((err)) {
      console.error("Register Axios error:", {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      const backendMsg = err.response?.data?.message;

      if (backendMsg) {
        // this will show "Email already in use" or "Something went wrong"
        setError(backendMsg);
      } else if (!err.response) {
        // no response at all -> probably CORS / server down
        setError("Network error: could not reach the server.");
      } else {
        setError("Unexpected error from server.");
      }
    } else {
      console.error("Register unknown error:", err);
      setError("Unexpected error on the client.");
    }
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo-box">
        {/* will add logo here later } */}
            </div>
            <h1 className="auth-title">Shipment Daily</h1>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid-2">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              placeholder="Location (city / area)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p className="auth-error">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

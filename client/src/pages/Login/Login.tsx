import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { AuthAPI } from "../../api/queries";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const out = await AuthAPI.login({ email, password });

      localStorage.setItem("accessToken", out.accessToken);
      localStorage.setItem("refreshToken", out.refreshToken);
      localStorage.setItem("user", JSON.stringify(out.user));

      navigate("/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
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
            <p className="auth-subtitle">
              Welcome back! Please login to continue
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="auth-error">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="auth-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

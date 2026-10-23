
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "RECRUITER",
    institutionName: "",
    institutionCode: "",
    address: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const details = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role
      };

      if (form.role === "INSTITUTION") {
        details.institutionName = form.institutionName.trim();
        details.institutionCode =
          form.institutionCode.trim().toUpperCase();
        details.address = form.address.trim();
      }

      await register(details);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-mark">CC</div>

        <h1>Create account</h1>
        <p className="muted">Join CredentialChain</p>

        {error && <div className="alert">{error}</div>}

        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          minLength={2}
          maxLength={100}
          autoComplete="name"
          required
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 12 characters"
          minLength={12}
          maxLength={72}
          autoComplete="new-password"
          required
        />

        <label htmlFor="role">Account role</label>
        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="RECRUITER">Recruiter</option>
          <option value="INSTITUTION">Institution</option>
          <option value="ADMIN">Admin</option>
        </select>

        {form.role === "INSTITUTION" && (
          <>
            <label htmlFor="institutionName">
              Institution name
            </label>
            <input
              id="institutionName"
              name="institutionName"
              type="text"
              value={form.institutionName}
              onChange={handleChange}
              placeholder="Enter university or college name"
              minLength={2}
              required
            />

            <label htmlFor="institutionCode">
              Institution code
            </label>
            <input
              id="institutionCode"
              name="institutionCode"
              type="text"
              value={form.institutionCode}
              onChange={handleChange}
              placeholder="Example: ABC001"
              minLength={2}
              maxLength={30}
              required
            />

            <label htmlFor="address">
              Institution address
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter institution address"
              rows={3}
            />

            <p className="muted">
              Your institution must be verified by an admin
              before issuing certificates.
            </p>
          </>
        )}

        {form.role === "ADMIN" && (
          <p className="muted">
            You are registering an administrator account with
            access to administrative features.
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

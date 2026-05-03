import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { authApi } from "../api/client";
import AuthShell from "../components/AuthShell";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    token: searchParams.get("token") || "",
    new_password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.new_password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.resetPassword({
        token: formData.token,
        new_password: formData.new_password,
      });
      setSuccessMessage(response.message);
      setFormData((current) => ({
        ...current,
        new_password: "",
        confirmPassword: "",
      }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="New Password"
      title="Choose a new password"
      subtitle="Use your reset token to update your password and return to your StudyFlow workspace."
      footerText="Already reset it?"
      footerLinkLabel="Login here."
      footerLinkTo="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-label">
          Reset Token
          <textarea
            name="token"
            value={formData.token}
            onChange={handleChange}
            rows="3"
            placeholder="Paste your reset token here"
            required
          />
        </label>

        <label className="field-label">
          New Password
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Create a new password"
            required
          />
        </label>

        <label className="field-label">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your new password"
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {successMessage ? (
          <div className="auth-demo-token">
            <p className="success-text">{successMessage}</p>
            <Link className="button" to="/login">
              Go to Login
            </Link>
          </div>
        ) : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Updating password..." : "Reset Password"}
        </button>
      </form>
    </AuthShell>
  );
}

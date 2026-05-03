import { useState } from "react";
import { Link } from "react-router-dom";

import { authApi } from "../api/client";
import AuthShell from "../components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setResetToken("");
    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword({ email });
      setSuccessMessage(response.message);
      setResetToken(response.reset_token || "");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetLink = resetToken ? `/reset-password?token=${encodeURIComponent(resetToken)}` : "";

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Reset your StudyFlow password"
      subtitle="Enter your email and we will prepare a reset link for this prototype."
      footerText="Remember your password?"
      footerLinkLabel="Back to login."
      footerLinkTo="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-label">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="student@example.com"
            required
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {successMessage ? <p className="success-text">{successMessage}</p> : null}

        {resetToken ? (
          <div className="auth-demo-token">
            <p className="mini-summary-label">Prototype reset link</p>
            <p className="helper-text">
              Email sending is not connected yet, so StudyFlow shows the reset link here for the
              class demo.
            </p>
            <Link className="button" to={resetLink}>
              Continue to Reset Password
            </Link>
          </div>
        ) : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Preparing link..." : "Send Reset Link"}
        </button>
      </form>
    </AuthShell>
  );
}

import { Link } from "react-router-dom";

import BrandMark from "./BrandMark";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}) {
  return (
    <section className="auth-layout">
      <div className="auth-side">
        <div className="auth-brand">
          <BrandMark />
          <span>StudyFlow</span>
        </div>

        <div className="auth-copy">
          <p className="auth-kicker">AI Study Optimization</p>
          <h1>Build a study routine that actually feels manageable.</h1>
          <p>
            Keep courses, assignments, study blocks, and future AI guidance inside one
            focused student workspace.
          </p>
        </div>

        <div className="auth-preview">
          <div className="auth-preview-card auth-preview-card-primary">
            <p>Today&apos;s focus</p>
            <strong>Cellular Respiration Quiz</strong>
            <span>AI recommended 2-hour focus session</span>
          </div>

          <div className="auth-preview-grid">
            <div className="auth-preview-card">
              <p>Upcoming</p>
              <strong>3 Assignments</strong>
            </div>
            <div className="auth-preview-card">
              <p>Study plan</p>
              <strong>4 Sessions</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card-shell">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="helper-text">{subtitle}</p>

          {children}

          <p className="helper-text auth-footer-text">
            {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

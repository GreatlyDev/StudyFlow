import { Link } from "react-router-dom";

import landingHeroImage from "../assets/studyflow-landing-page.png";
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
    <section
      className="auth-layout auth-hero-layout"
      style={{ "--auth-hero-image": `url(${landingHeroImage})` }}
    >
      <div className="auth-side">
        <div className="auth-brand">
          <BrandMark />
          <span>StudyFlow</span>
        </div>

        <div className="auth-copy">
          <p className="auth-kicker">AI Study Optimization</p>
          <h1>Turn scattered study time into a focused plan.</h1>
          <p>
            Upload study material, organize deadlines, review flashcards, and let StudyFlow
            help shape the next best study move.
          </p>
        </div>

        <div className="auth-preview">
          <div className="auth-preview-card auth-preview-card-primary">
            <p>AI-powered focus</p>
            <strong>Cellular Respiration Quiz</strong>
            <span>Recommendation based on your materials and deadlines</span>
          </div>

          <div className="auth-preview-grid">
            <div className="auth-preview-card">
              <p>Study tools</p>
              <strong>Flashcards + quizzes</strong>
            </div>
            <div className="auth-preview-card">
              <p>Planning</p>
              <strong>Schedules + reminders</strong>
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

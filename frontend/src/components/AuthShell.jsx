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
          <p className="auth-kicker">AI Study</p>
          <h1>StudyFlow</h1>
          <p>Your AI study optimization workspace. Let&apos;s shape your workflow.</p>
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

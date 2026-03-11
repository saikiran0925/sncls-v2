import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "../data/siteConfig";
import "../css/LandingPage.css";

/* ── Feature card ──────────────────────────────────────────── */
const FeatureCard = ({ feature, index }) => {
  const { title, description, icon: Icon, route, accent, badge } = feature;

  return (
    <Link
      to={route}
      className="lp-card"
      style={{ "--card-accent": accent, animationDelay: `${index * 70}ms` }}
    >
      <div className="lp-card-inner">
        {/* Icon bubble */}
        <div className="lp-card-icon" style={{ backgroundColor: `${accent}18`, color: accent }}>
          <Icon size={22} />
        </div>

        {/* Badge */}
        {badge && (
          <span className="lp-badge" style={{ backgroundColor: `${accent}18`, color: accent }}>
            {badge}
          </span>
        )}

        <h3 className="lp-card-title">{title}</h3>
        <p className="lp-card-desc">{description}</p>

        <div className="lp-card-cta" style={{ color: accent }}>
          Open {title} →
        </div>
      </div>
    </Link>
  );
};

/* ── Landing page ──────────────────────────────────────────── */
const LandingPage = () => {
  const { name, pronunciation, tagline, description, ctaLabel, ctaRoute, features, footer } = siteConfig;

  return (
    <>
      <Helmet>
        <title>SNCLS — Essential Developer Tools</title>
        <meta name="description" content={description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="lp-root">

        {/* ── Navbar ───────────────────────────────────────── */}
        <nav className="lp-nav">
          <div className="lp-nav-inner">
            <Link to="/" className="lp-nav-logo">
              <span className="lp-nav-brand">{name}</span>
              <span className="lp-nav-pronounce">/{pronunciation}/</span>
            </Link>
            <Link to={ctaRoute} className="lp-nav-cta">
              {ctaLabel}
            </Link>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="lp-hero">
          {/* Decorative blobs */}
          <div className="lp-blob lp-blob-1" aria-hidden="true" />
          <div className="lp-blob lp-blob-2" aria-hidden="true" />

          <div className="lp-hero-content">
            <div className="lp-hero-eyebrow">Developer Toolkit</div>
            <h1 className="lp-hero-heading">
              Every tool you reach for,{" "}
              <span className="lp-hero-gradient">in one place.</span>
            </h1>
            <p className="lp-hero-sub">{description}</p>
            <div className="lp-hero-actions">
              <a href="#features" className="lp-btn-primary">
                Browse Tools ↓
              </a>
            </div>

            {/* Stat pills */}
            <div className="lp-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">{features.length}</span>
                <span className="lp-stat-label">Tools</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">100%</span>
                <span className="lp-stat-label">Offline</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-num">0</span>
                <span className="lp-stat-label">Sign-ups needed</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature grid ─────────────────────────────────── */}
        <section className="lp-features" id="features">
          <div className="lp-section-header">
            <h2 className="lp-section-title">What's inside?</h2>
            <p className="lp-section-sub">
              Pick a tool and get started — no install, no signup, no wait.
            </p>
          </div>

          <div className="lp-grid">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="lp-footer">
          <span>{footer.copy}</span>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

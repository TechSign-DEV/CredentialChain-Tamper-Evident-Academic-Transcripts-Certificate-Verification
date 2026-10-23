
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileCheck2,
  Fingerprint,
  Building2,
  SearchCheck,
  LockKeyhole,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  BadgeCheck,
  Menu,
  X,
  ClipboardCheck
} from "lucide-react";
import { useState } from "react";

const styles = `
.cc-home {
  --home-ink: #17233d;
  --home-muted: #66758e;
  --home-blue: #4267e8;
  color: var(--home-ink);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  background: #fff;
  min-height: 100vh;
}
.cc-home * { box-sizing: border-box; }
.cc-home a { text-decoration: none; }
.cc-home button { font: inherit; }
.cc-home .home-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 17px clamp(20px, 6vw, 90px);
  border-bottom: 1px solid #edf0f7;
  background: rgba(255,255,255,.94);
  backdrop-filter: blur(14px);
}
.cc-home .home-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  color: #182743;
  font-size: 18px;
  font-weight: 850;
  letter-spacing: -.6px;
}
.cc-home .brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  color: white;
  background: linear-gradient(140deg,#5279ff,#2948ba);
  box-shadow: 0 7px 16px #4267e82c;
}
.cc-home .brand-mark svg { width: 23px; height: 23px; }
.cc-home .brand-subtitle {
  display: block;
  margin-top: 2px;
  color: #8994a9;
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 1.6px;
}
.cc-home .nav-links { display: flex; align-items: center; gap: 29px; }
.cc-home .nav-links > a:not(.home-btn) {
  color: #68758c;
  font-size: 13px;
  font-weight: 650;
}
.cc-home .nav-links > a:not(.home-btn):hover { color: var(--home-blue); }
.cc-home .home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 43px;
  padding: 11px 17px;
  border: 1px solid transparent;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 750;
  transition: transform .18s ease, background .18s ease;
}
.cc-home .home-btn:hover { transform: translateY(-1px); }
.cc-home .home-btn-primary { color: white; background: #4267e8; box-shadow: 0 5px 14px #4267e826; }
.cc-home .home-btn-primary:hover { background: #304fc6; }
.cc-home .home-btn-light { color: #33445f; border-color: #e1e7f1; background: white; }
.cc-home .home-btn-light:hover { background: #f5f7fc; }
.cc-home .home-btn svg { width: 16px; height: 16px; }
.cc-home .mobile-toggle { display: none; place-items: center; width: 42px; height: 42px; border: 1px solid #e3e8f2; border-radius: 11px; background: #fff; color: #243451; }
.cc-home .mobile-toggle svg { width: 21px; height: 21px; }
.cc-home .home-hero {
  position: relative;
  overflow: hidden;
  padding: 80px clamp(20px, 7vw, 100px) 78px;
  background:
    radial-gradient(ellipse at 90% 10%, rgba(94,126,255,.15), transparent 35%),
    radial-gradient(ellipse at 4% 95%, rgba(98,165,255,.12), transparent 30%),
    linear-gradient(135deg,#f8faff,#fff 52%,#f4f7ff);
}
.cc-home .hero-grid {
  position: absolute;
  inset: 0;
  opacity: .26;
  pointer-events: none;
  background-image: linear-gradient(#dfe6f6 1px,transparent 1px),linear-gradient(90deg,#dfe6f6 1px,transparent 1px);
  background-size: 46px 46px;
  mask-image: linear-gradient(90deg,transparent,black 65%,black);
}
.cc-home .hero-inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0,1.05fr) minmax(360px,.95fr);
  align-items: center;
  gap: clamp(35px,6vw,90px);
  max-width: 1250px;
  margin: 0 auto;
}
.cc-home .hero-copy { min-width: 0; }
.cc-home .hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #dfe7ff;
  border-radius: 999px;
  color: #3d5fce;
  background: #f0f4ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .6px;
}
.cc-home .hero-tag svg { width: 15px; height: 15px; }
.cc-home .hero-copy h1 {
  margin: 25px 0 19px;
  color: #17233d;
  font-size: clamp(38px,5.1vw,64px);
  font-weight: 850;
  line-height: 1.08;
  letter-spacing: -2.8px;
}
.cc-home .hero-copy h1 span {
  color: #4267e8;
  background: linear-gradient(100deg,#527aff,#3452cb);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cc-home .hero-description {
  max-width: 570px;
  margin: 0;
  color: #66758e;
  font-size: 15px;
  line-height: 1.9;
}
.cc-home .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 29px; }
.cc-home .hero-assurance {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 26px;
  color: #687791;
  font-size: 11px;
  font-weight: 650;
}
.cc-home .hero-assurance span { display: inline-flex; align-items: center; gap: 7px; }
.cc-home .hero-assurance svg { width: 15px; height: 15px; color: #278d69; }
.cc-home .hero-visual { position: relative; min-width: 0; }
.cc-home .visual-glow {
  position: absolute;
  inset: 12% 4%;
  border-radius: 50%;
  background: #7a96ff2b;
  filter: blur(40px);
}
.cc-home .verify-card {
  position: relative;
  max-width: 470px;
  margin: 0 auto;
  padding: 25px;
  border: 1px solid #e3e9f5;
  border-radius: 23px;
  background: rgba(255,255,255,.93);
  box-shadow: 0 30px 80px rgba(39,61,111,.13),0 5px 20px rgba(39,61,111,.04);
}
.cc-home .verify-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 19px; border-bottom: 1px solid #eef1f7; }
.cc-home .verify-card-title { display: flex; align-items: center; gap: 11px; }
.cc-home .mini-shield { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; color: #4267e8; background: #edf2ff; }
.cc-home .mini-shield svg { width: 22px; height: 22px; }
.cc-home .verify-card-title strong { display: block; color: #23334f; font-size: 13px; }
.cc-home .verify-card-title small { display: block; margin-top: 4px; color: #8995a9; font-size: 10px; }
.cc-home .demo-chip { padding: 6px 9px; border-radius: 7px; color: #6a7c9b; background: #f3f6fb; font-size: 9px; font-weight: 800; }
.cc-home .document-preview { position: relative; display: flex; gap: 15px; margin: 21px 0; padding: 18px; border: 1px solid #e9edf5; border-radius: 14px; background: #fbfcff; }
.cc-home .document-icon { display: grid; place-items: center; flex: 0 0 45px; height: 51px; border-radius: 10px; color: #4267e8; background: #eaf0ff; }
.cc-home .document-icon svg { width: 24px; height: 24px; }
.cc-home .document-lines { flex: 1; padding-top: 3px; }
.cc-home .document-lines strong { display: block; margin-bottom: 10px; color: #34435d; font-size: 12px; }
.cc-home .document-lines span { display: block; width: 88%; height: 5px; margin-top: 7px; border-radius: 10px; background: #e4e9f3; }
.cc-home .document-lines span:last-child { width: 57%; }
.cc-home .hash-row { display: flex; align-items: flex-start; gap: 11px; margin: 18px 0; }
.cc-home .hash-icon { display: grid; place-items: center; flex: 0 0 35px; width: 35px; height: 35px; border-radius: 10px; color: #4267e8; background: #f0f3ff; }
.cc-home .hash-icon svg { width: 18px; height: 18px; }
.cc-home .hash-row strong { display: block; margin: 1px 0 5px; color: #43516a; font-size: 11px; }
.cc-home .hash-row small { display: block; overflow-wrap: anywhere; color: #8b96a9; font-family: ui-monospace,monospace; font-size: 9px; line-height: 1.7; }
.cc-home .verified-banner { display: flex; align-items: center; gap: 12px; padding: 14px; border: 1px solid #c9eddd; border-radius: 12px; color: #167650; background: #effbf5; }
.cc-home .verified-banner > svg { flex: 0 0 22px; width: 22px; height: 22px; }
.cc-home .verified-banner strong { display: block; font-size: 12px; }
.cc-home .verified-banner small { display: block; margin-top: 4px; color: #438a70; font-size: 10px; }
.cc-home .floating-note {
  position: absolute;
  right: -18px;
  bottom: -25px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  border: 1px solid #e7ebf4;
  border-radius: 13px;
  background: white;
  box-shadow: 0 13px 32px rgba(32,51,93,.12);
}
.cc-home .floating-note-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; color: #278d69; background: #e9f9f1; }
.cc-home .floating-note-icon svg { width: 19px; height: 19px; }
.cc-home .floating-note strong { display: block; color: #2d3d57; font-size: 11px; }
.cc-home .floating-note small { display: block; margin-top: 4px; color: #8b96a9; font-size: 9px; }
.cc-home .trust-strip { display: flex; justify-content: center; flex-wrap: wrap; gap: 22px 46px; padding: 25px 20px; border-top: 1px solid #edf0f6; border-bottom: 1px solid #edf0f6; background: #fff; }
.cc-home .trust-item { display: inline-flex; align-items: center; gap: 9px; color: #64738d; font-size: 11px; font-weight: 700; }
.cc-home .trust-item svg { width: 17px; height: 17px; color: #496ce0; }
.cc-home .home-section { padding: 78px clamp(20px,7vw,100px); }
.cc-home .section-inner { max-width: 1190px; margin: 0 auto; }
.cc-home .section-heading { max-width: 660px; margin: 0 auto 38px; text-align: center; }
.cc-home .section-kicker { margin: 0 0 12px; color: #4267e8; font-size: 10px; font-weight: 850; letter-spacing: 1.7px; text-transform: uppercase; }
.cc-home .section-heading h2 { margin: 0; color: #1b2943; font-size: clamp(28px,3.4vw,41px); line-height: 1.2; font-weight: 820; letter-spacing: -1.3px; }
.cc-home .section-heading > p:last-child { margin: 14px auto 0; color: #748198; font-size: 13px; line-height: 1.9; }
.cc-home .features-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; }
.cc-home .feature-card { padding: 25px; border: 1px solid #e8ecf4; border-radius: 17px; background: white; transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
.cc-home .feature-card:hover { transform: translateY(-4px); border-color: #d4defc; box-shadow: 0 15px 34px rgba(32,54,103,.065); }
.cc-home .feature-icon { display: grid; place-items: center; width: 47px; height: 47px; margin-bottom: 19px; border-radius: 14px; color: #4267e8; background: #eef2ff; }
.cc-home .feature-icon svg { width: 23px; height: 23px; }
.cc-home .feature-card h3 { margin: 0 0 9px; color: #24334e; font-size: 15px; font-weight: 780; }
.cc-home .feature-card p { margin: 0; color: #78859a; font-size: 12px; line-height: 1.85; }
.cc-home .workflow-section { background: #f7f9fe; }
.cc-home .steps-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 24px; }
.cc-home .step-card { position: relative; padding: 25px; border: 1px solid #e6ebf5; border-radius: 16px; background: white; }
.cc-home .step-number { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 17px; border-radius: 11px; color: #4167e5; background: #edf2ff; font-size: 12px; font-weight: 850; }
.cc-home .step-card h3 { margin: 0 0 8px; color: #263550; font-size: 14px; }
.cc-home .step-card p { margin: 0; color: #7c899e; font-size: 12px; line-height: 1.85; }
.cc-home .cta-section { padding: 0 clamp(20px,7vw,100px) 75px; }
.cc-home .cta-panel { position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between; gap: 24px; max-width: 1190px; margin: 0 auto; padding: 36px 40px; border-radius: 21px; color: white; background: linear-gradient(115deg,#172849,#3457c7); }
.cc-home .cta-panel::after { content: ""; position: absolute; width: 260px; height: 260px; right: 15%; top: -180px; border: 1px solid #ffffff22; border-radius: 50%; box-shadow: 0 0 0 30px #ffffff08,0 0 0 60px #ffffff06; pointer-events: none; }
.cc-home .cta-panel h2 { position: relative; z-index: 1; margin: 0; font-size: clamp(23px,3vw,31px); letter-spacing: -.8px; }
.cc-home .cta-panel p { position: relative; z-index: 1; margin: 10px 0 0; color: #d2defe; font-size: 12px; line-height: 1.8; }
.cc-home .cta-panel .home-btn { position: relative; z-index: 1; flex: 0 0 auto; color: #2847b5; background: white; }
.cc-home .home-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px clamp(20px,7vw,100px); border-top: 1px solid #edf0f6; color: #8792a5; font-size: 11px; }
.cc-home .footer-brand { display: flex; align-items: center; gap: 9px; color: #52627d; font-weight: 800; }
.cc-home .footer-brand svg { width: 20px; height: 20px; color: #4267e8; }
.cc-home .footer-note { margin: 0; }
@media (max-width: 950px) {
  .cc-home .hero-inner { grid-template-columns: minmax(0,1fr) minmax(300px,.85fr); gap: 32px; }
  .cc-home .hero-copy h1 { letter-spacing: -1.8px; }
  .cc-home .floating-note { right: -5px; }
  .cc-home .features-grid,.cc-home .steps-grid { gap: 12px; }
  .cc-home .feature-card,.cc-home .step-card { padding: 19px; }
}
@media (max-width: 740px) {
  .cc-home .home-nav { flex-wrap: wrap; padding: 13px 19px; }
  .cc-home .mobile-toggle { display: grid; }
  .cc-home .nav-links { display: none; width: 100%; align-items: stretch; gap: 5px; padding: 10px 0 4px; }
  .cc-home .nav-links.open { display: flex; flex-direction: column; }
  .cc-home .nav-links > a:not(.home-btn) { padding: 11px 5px; }
  .cc-home .nav-links .home-btn { width: 100%; }
  .cc-home .home-hero { padding-top: 53px; padding-bottom: 55px; }
  .cc-home .hero-inner { grid-template-columns: 1fr; gap: 52px; }
  .cc-home .hero-copy h1 { max-width: 560px; font-size: clamp(39px,9vw,59px); }
  .cc-home .hero-description { font-size: 14px; }
  .cc-home .hero-visual { width: 100%; max-width: 480px; margin: 0 auto; }
  .cc-home .floating-note { right: 4px; }
  .cc-home .trust-strip { gap: 18px 24px; }
  .cc-home .home-section { padding-top: 57px; padding-bottom: 57px; }
  .cc-home .features-grid,.cc-home .steps-grid { grid-template-columns: 1fr; gap: 13px; }
  .cc-home .feature-card,.cc-home .step-card { padding: 23px; }
  .cc-home .cta-section { padding-bottom: 55px; }
  .cc-home .cta-panel { align-items: flex-start; flex-direction: column; padding: 29px 24px; }
  .cc-home .home-footer { align-items: flex-start; flex-direction: column; padding-top: 20px; padding-bottom: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .cc-home *, .cc-home *::before, .cc-home *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;

const features = [
  {
    icon: Fingerprint,
    title: "SHA-256 Document Fingerprints",
    description:
      "Compare a certificate's cryptographic fingerprint with its registered record to help identify modified files."
  },
  {
    icon: ShieldCheck,
    title: "Tamper-Evident Audit Trail",
    description:
      "Record key certificate actions with actor, event details, and timestamps for easier review and accountability."
  },
  {
    icon: Building2,
    title: "Institution Approval",
    description:
      "Administrators review institution registrations before approved institutions can issue certificates."
  },
  {
    icon: SearchCheck,
    title: "Quick Certificate Checks",
    description:
      "Recruiters can submit a certificate for a record and integrity check without relying only on paper copies."
  },
  {
    icon: LockKeyhole,
    title: "Role-Based Access",
    description:
      "Separate workflows for administrators, institutions, and recruiters help protect sensitive operations."
  },
  {
    icon: FileSearch,
    title: "Revocation Awareness",
    description:
      "Verification includes checking the certificate record's current status, including whether it has been revoked."
  }
];

const steps = [
  {
    number: "01",
    title: "Register the institution",
    description:
      "An institution submits its registration details and waits for administrator review and approval."
  },
  {
    number: "02",
    title: "Register a certificate",
    description:
      "An approved institution uploads a certificate PDF and records its academic details and file fingerprint."
  },
  {
    number: "03",
    title: "Verify credentials",
    description:
      "A recruiter checks a submitted certificate against its registered record and current status."
  }
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="cc-home">
      <style>{styles}</style>

      <nav className="home-nav">
        <Link to="/" className="home-brand" onClick={closeMenu}>
          <span className="brand-mark">
            <ShieldCheck />
          </span>
          <span>
            CredentialChain
            <span className="brand-subtitle">ACADEMIC TRUST NETWORK</span>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <Link to="/login" onClick={closeMenu}>Sign in</Link>
          <Link
            to="/register"
            className="home-btn home-btn-primary"
            onClick={closeMenu}
          >
            Get started <ArrowRight />
          </Link>
        </div>
      </nav>

      <main>
        <section className="home-hero">
          <div className="hero-grid" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-tag">
                <ShieldCheck />
                TRUSTED ACADEMIC CREDENTIALS
              </div>

              <h1>
                Academic credentials.
                <br />
                <span>Made verifiable.</span>
              </h1>

              <p className="hero-description">
                A smarter way to check academic certificates. CredentialChain
                helps institutions register credentials and helps recruiters
                verify document fingerprints, certificate status, and recorded
                verification activity.
              </p>

              <div className="hero-actions">
                <Link to="/register" className="home-btn home-btn-primary">
                  Create an account <ArrowRight />
                </Link>
                <Link to="/login" className="home-btn home-btn-light">
                  Sign in to workspace
                </Link>
              </div>

              <div className="hero-assurance">
                <span><CheckCircle2 /> SHA-256 fingerprints</span>
                <span><CheckCircle2 /> Role-based access</span>
                <span><CheckCircle2 /> Audit visibility</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Illustration of certificate verification">
              <div className="visual-glow" />
              <div className="verify-card">
                <div className="verify-card-head">
                  <div className="verify-card-title">
                    <span className="mini-shield"><ShieldCheck /></span>
                    <span>
                      <strong>Credential verification</strong>
                      <small>Document integrity overview</small>
                    </span>
                  </div>
                  <span className="demo-chip">ILLUSTRATION</span>
                </div>

                <div className="document-preview">
                  <div className="document-icon"><FileCheck2 /></div>
                  <div className="document-lines">
                    <strong>Academic_Certificate.pdf</strong>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="hash-row">
                  <div className="hash-icon"><Fingerprint /></div>
                  <div>
                    <strong>SHA-256 fingerprint</strong>
                    <small>Computed from the uploaded document</small>
                    <small>9f2c...illustrative-fingerprint...7a31</small>
                  </div>
                </div>

                <div className="verified-banner">
                  <BadgeCheck />
                  <span>
                    <strong>Verification workflow</strong>
                    <small>Compare record, fingerprint, and current status</small>
                  </span>
                </div>
              </div>

              <div className="floating-note">
                <span className="floating-note-icon"><LockKeyhole /></span>
                <span>
                  <strong>Security-conscious design</strong>
                  <small>Integrity checks and audit records</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="trust-strip">
          <span className="trust-item"><Fingerprint /> Cryptographic fingerprints</span>
          <span className="trust-item"><Building2 /> Institution approval</span>
          <span className="trust-item"><ClipboardCheck /> Auditable activity</span>
          <span className="trust-item"><LockKeyhole /> Role-based permissions</span>
        </div>

        <section className="home-section" id="features">
          <div className="section-inner">
            <div className="section-heading">
              <p className="section-kicker">Built for confidence</p>
              <h2>Verification you can understand</h2>
              <p>
                Tools designed to make academic credential checks clearer,
                more traceable, and easier to manage.
              </p>
            </div>

            <div className="features-grid">
              {features.map(({ icon: Icon, title, description }) => (
                <article className="feature-card" key={title}>
                  <div className="feature-icon"><Icon /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section workflow-section" id="how-it-works">
          <div className="section-inner">
            <div className="section-heading">
              <p className="section-kicker">Simple workflow</p>
              <h2>From issuance to verification</h2>
              <p>
                A straightforward process for institutions, administrators,
                and recruiters.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map(({ number, title, description }) => (
                <article className="step-card" key={number}>
                  <div className="step-number">{number}</div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <div>
              <h2>Bring clarity to credential checks.</h2>
              <p>
                Sign in to your workspace or create an account to get started.
              </p>
            </div>
            <Link to="/register" className="home-btn">
              Get started <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-brand">
          <ShieldCheck />
          CredentialChain
        </div>
        <p className="footer-note">
          Academic credential registration and verification.
        </p>
        <span>© {new Date().getFullYear()} CredentialChain</span>
      </footer>
    </div>
  );
}


import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail,
  MapPin,
  CalendarDays,
  Hash,
  Search,
  Landmark,
  AlertCircle,
  ArrowUpRight,
  X,
  ClipboardCheck
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const styles = `
.admin-institutions {
  --cc-primary: #4169e1;
  --cc-primary-dark: #2f4fc1;
  --cc-ink: #17233d;
  --cc-muted: #78849b;
  --cc-border: #e7ebf3;
  --cc-surface: #ffffff;
  color: var(--cc-ink);
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 30px;
  box-sizing: border-box;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.admin-institutions * { box-sizing: border-box; }
.admin-institutions button,
.admin-institutions input,
.admin-institutions textarea { font: inherit; }
.admin-institutions button { cursor: pointer; transition: all .18s ease; }
.admin-institutions button:disabled { opacity: .55; cursor: not-allowed; }
.admin-institutions .cc-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  border-radius: 22px;
  color: white;
  background: linear-gradient(115deg, #142344 0%, #243f78 57%, #4169e1 100%);
  box-shadow: 0 15px 38px rgba(37, 66, 131, .16);
}
.admin-institutions .cc-hero::before,
.admin-institutions .cc-hero::after {
  content: "";
  position: absolute;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 50%;
  pointer-events: none;
}
.admin-institutions .cc-hero::before { width: 280px; height: 280px; right: -55px; top: -155px; }
.admin-institutions .cc-hero::after { width: 200px; height: 200px; right: 65px; bottom: -155px; }
.admin-institutions .cc-hero-content { position: relative; z-index: 1; min-width: 0; }
.admin-institutions .cc-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #c4d4ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.admin-institutions .cc-hero h1 {
  margin: 0;
  color: #fff;
  font-size: clamp(25px, 3vw, 35px);
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -.9px;
}
.admin-institutions .cc-hero p.cc-subtitle {
  margin: 12px 0 0;
  max-width: 560px;
  color: #d8e2fa;
  font-size: 14px;
  line-height: 1.75;
}
.admin-institutions .cc-hero-icon {
  z-index: 1;
  flex: 0 0 70px;
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 21px;
  background: rgba(255,255,255,.12);
  color: #fff;
}
.admin-institutions .cc-refresh {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 11px 16px;
  border: 1px solid rgba(255,255,255,.32);
  border-radius: 12px;
  color: white;
  background: rgba(255,255,255,.12);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
.admin-institutions .cc-refresh:hover { background: rgba(255,255,255,.22); }
.admin-institutions .cc-refresh svg { width: 16px; height: 16px; }
.admin-institutions .cc-section-label {
  margin: 30px 0 14px;
  color: #6f7d95;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.admin-institutions .cc-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}
.admin-institutions .cc-stat {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 22px;
  background: var(--cc-surface);
  border: 1px solid var(--cc-border);
  border-radius: 17px;
  box-shadow: 0 4px 14px rgba(25, 43, 78, .025);
}
.admin-institutions .cc-stat:hover { border-color: #cad6fa; transform: translateY(-2px); }
.admin-institutions .cc-stat-label { margin: 0 0 12px; color: #78849b; font-size: 12px; font-weight: 650; }
.admin-institutions .cc-stat-number { margin: 0; color: #17233d; font-size: 32px; font-weight: 800; line-height: 1; letter-spacing: -1px; }
.admin-institutions .cc-stat-note { margin: 10px 0 0; color: #8b96a9; font-size: 11px; }
.admin-institutions .cc-stat-icon {
  display: grid;
  place-items: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 15px;
}
.admin-institutions .cc-stat-icon svg { width: 22px; height: 22px; }
.admin-institutions .cc-stat-icon.blue { color: #4169e1; background: #edf2ff; }
.admin-institutions .cc-stat-icon.amber { color: #b7791f; background: #fff5df; }
.admin-institutions .cc-stat-icon.green { color: #18835d; background: #e4f7ee; }
.admin-institutions .cc-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 28px 0 16px;
}
.admin-institutions .cc-toolbar h2 { margin: 0; color: #1b2943; font-size: 19px; font-weight: 780; letter-spacing: -.4px; }
.admin-institutions .cc-toolbar p { margin: 6px 0 0; color: #8792a6; font-size: 12px; }
.admin-institutions .cc-count {
  padding: 7px 11px;
  border: 1px solid #e0e7fb;
  border-radius: 9px;
  color: #4169e1;
  background: #f2f5ff;
  font-size: 12px;
  font-weight: 750;
  white-space: nowrap;
}
.admin-institutions .cc-search-wrap { position: relative; margin-bottom: 17px; }
.admin-institutions .cc-search-wrap svg {
  position: absolute;
  top: 50%;
  left: 15px;
  width: 17px;
  height: 17px;
  color: #98a3b5;
  transform: translateY(-50%);
  pointer-events: none;
}
.admin-institutions .cc-search {
  width: 100%;
  min-height: 46px;
  padding: 12px 15px 12px 43px;
  border: 1px solid #e3e8f1;
  border-radius: 12px;
  outline: none;
  color: #25334d;
  background: #fff;
  font-size: 13px;
}
.admin-institutions .cc-search:focus,
.admin-institutions .cc-reason:focus { border-color: #7692f0; box-shadow: 0 0 0 3px rgba(65,105,225,.1); }
.admin-institutions .cc-list { display: grid; gap: 14px; }
.admin-institutions .cc-card {
  min-width: 0;
  padding: 22px;
  border: 1px solid #e5eaf2;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(22, 39, 72, .025);
  transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.admin-institutions .cc-card:hover { border-color: #d5def7; box-shadow: 0 10px 27px rgba(34, 56, 105, .065); }
.admin-institutions .cc-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.admin-institutions .cc-org { display: flex; align-items: flex-start; gap: 14px; min-width: 0; }
.admin-institutions .cc-org-icon {
  display: grid;
  place-items: center;
  flex: 0 0 47px;
  width: 47px;
  height: 47px;
  border: 1px solid #e2e9ff;
  border-radius: 14px;
  color: #4169e1;
  background: linear-gradient(145deg, #f3f6ff, #e8eeff);
}
.admin-institutions .cc-org h3 { margin: 1px 0 7px; overflow-wrap: anywhere; color: #1c2a43; font-size: 16px; font-weight: 760; }
.admin-institutions .cc-code { display: inline-flex; align-items: center; gap: 5px; color: #8792a6; font-size: 11px; }
.admin-institutions .cc-code svg { width: 13px; height: 13px; }
.admin-institutions .cc-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 7px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .5px;
  white-space: nowrap;
}
.admin-institutions .cc-status svg { width: 13px; height: 13px; }
.admin-institutions .cc-status.pending { color: #9a6700; background: #fff6df; border-color: #f8e8b9; }
.admin-institutions .cc-status.verified { color: #167650; background: #e7f8ef; border-color: #c8eedb; }
.admin-institutions .cc-status.rejected { color: #b42336; background: #fff0f1; border-color: #f6d5d9; }
.admin-institutions .cc-details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin: 20px 0 0;
  padding-top: 17px;
  border-top: 1px solid #f0f2f7;
}
.admin-institutions .cc-detail { display: flex; align-items: flex-start; gap: 9px; min-width: 0; color: #8290a5; }
.admin-institutions .cc-detail > svg { flex: 0 0 16px; width: 16px; height: 16px; margin-top: 2px; color: #9aa6b9; }
.admin-institutions .cc-detail span { display: block; margin-bottom: 5px; color: #9aa4b5; font-size: 10px; font-weight: 650; text-transform: uppercase; letter-spacing: .5px; }
.admin-institutions .cc-detail strong { display: block; overflow-wrap: anywhere; color: #485770; font-size: 12px; font-weight: 600; line-height: 1.6; }
.admin-institutions .cc-rejection-note { margin: 15px 0 0; padding: 12px 14px; border: 1px solid #f5d9dc; border-radius: 11px; color: #a52c3d; background: #fff7f7; font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.admin-institutions .cc-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; margin-top: 19px; padding-top: 16px; border-top: 1px solid #f0f2f7; }
.admin-institutions .cc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 9px 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 750;
}
.admin-institutions .cc-btn svg { width: 15px; height: 15px; }
.admin-institutions .cc-btn-primary { color: white; background: #4169e1; box-shadow: 0 3px 8px rgba(65,105,225,.15); }
.admin-institutions .cc-btn-primary:hover { background: #2f4fc1; transform: translateY(-1px); }
.admin-institutions .cc-btn-danger { color: #b42336; border-color: #f2d4d9; background: #fff; }
.admin-institutions .cc-btn-danger:hover { border-color: #e7a9b2; background: #fff5f6; }
.admin-institutions .cc-btn-quiet { color: #586780; border-color: #e1e7f0; background: #fff; }
.admin-institutions .cc-btn-quiet:hover { background: #f7f9fd; }
.admin-institutions .cc-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 18px 0;
  padding: 13px 15px;
  border: 1px solid #f4d2d6;
  border-radius: 12px;
  color: #a62c3e;
  background: #fff5f6;
  font-size: 13px;
  line-height: 1.55;
}
.admin-institutions .cc-alert svg { flex: 0 0 18px; width: 18px; height: 18px; }
.admin-institutions .cc-form-panel {
  margin: 22px 0;
  padding: 23px;
  border: 1px solid #e4e9f2;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 9px 26px rgba(22,39,72,.055);
}
.admin-institutions .cc-form-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; }
.admin-institutions .cc-form-heading h2 { margin: 0; font-size: 18px; }
.admin-institutions .cc-form-heading p { margin: 7px 0 0; color: #8390a5; font-size: 12px; line-height: 1.6; }
.admin-institutions .cc-close {
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border: 1px solid #e5e9f1;
  border-radius: 10px;
  color: #68758a;
  background: white;
}
.admin-institutions .cc-close svg { width: 17px; height: 17px; }
.admin-institutions .cc-field-label { display: block; margin: 19px 0 8px; color: #485770; font-size: 12px; font-weight: 750; }
.admin-institutions .cc-reason {
  display: block;
  width: 100%;
  min-height: 105px;
  padding: 12px 14px;
  resize: vertical;
  border: 1px solid #e1e7f0;
  border-radius: 11px;
  outline: none;
  color: #25334d;
  background: #fcfdff;
  font-size: 13px;
  line-height: 1.6;
}
.admin-institutions .cc-form-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; color: #96a0b1; font-size: 11px; }
.admin-institutions .cc-empty {
  padding: 48px 20px;
  border: 1px dashed #dbe2ef;
  border-radius: 18px;
  text-align: center;
  background: #fbfcff;
}
.admin-institutions .cc-empty-icon { display: grid; place-items: center; width: 55px; height: 55px; margin: 0 auto 15px; border-radius: 17px; color: #4169e1; background: #edf2ff; }
.admin-institutions .cc-empty-icon svg { width: 26px; height: 26px; }
.admin-institutions .cc-empty h3 { margin: 0; color: #273650; font-size: 16px; }
.admin-institutions .cc-empty p { max-width: 390px; margin: 8px auto 0; color: #8591a5; font-size: 12px; line-height: 1.7; }
.admin-institutions .cc-loading { padding: 30px 10px; text-align: center; color: #77849a; font-size: 13px; }
.admin-institutions .cc-spinner { width: 18px; height: 18px; border: 2px solid #dce4fc; border-top-color: #4169e1; border-radius: 50%; animation: cc-spin .7s linear infinite; }
.admin-institutions .cc-loading-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
@keyframes cc-spin { to { transform: rotate(360deg); } }
@media (max-width: 900px) {
  .admin-institutions { padding: 22px; }
  .admin-institutions .cc-stats { gap: 12px; }
  .admin-institutions .cc-stat { padding: 17px; }
  .admin-institutions .cc-details { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .admin-institutions { padding: 15px; }
  .admin-institutions .cc-hero { padding: 22px 19px; border-radius: 17px; align-items: flex-start; }
  .admin-institutions .cc-hero-icon { display: none; }
  .admin-institutions .cc-hero h1 { font-size: 25px; }
  .admin-institutions .cc-hero p.cc-subtitle { font-size: 12px; }
  .admin-institutions .cc-refresh { padding: 9px 10px; font-size: 11px; }
  .admin-institutions .cc-stats { grid-template-columns: 1fr; }
  .admin-institutions .cc-stat { padding: 16px; }
  .admin-institutions .cc-stat-number { font-size: 27px; }
  .admin-institutions .cc-toolbar { align-items: flex-start; }
  .admin-institutions .cc-card { padding: 16px; }
  .admin-institutions .cc-card-top { gap: 10px; }
  .admin-institutions .cc-org { gap: 10px; }
  .admin-institutions .cc-org-icon { width: 40px; height: 40px; flex-basis: 40px; }
  .admin-institutions .cc-org h3 { font-size: 14px; }
  .admin-institutions .cc-status { padding: 6px 8px; font-size: 9px; }
  .admin-institutions .cc-details { grid-template-columns: 1fr; gap: 13px; }
  .admin-institutions .cc-actions { align-items: stretch; }
  .admin-institutions .cc-actions .cc-btn { flex: 1; }
  .admin-institutions .cc-form-panel { padding: 17px; }
}
`;

export default function AdminInstitutions() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");

  const loadInstitutions = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.get("/institutions");
      setInstitutions(response.data.institutions || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load institutions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/dashboard", { replace: true });
      return;
    }

    loadInstitutions();
  }, [user, authLoading, navigate, loadInstitutions]);

  const getStatus = (institution) =>
    institution.verificationStatus ||
    (institution.isVerified ? "VERIFIED" : "PENDING");

  const handleApprove = async (institution) => {
    const confirmed = window.confirm(
      `Approve ${institution.name}?\n\nThis will mark the institution as verified.`
    );

    if (!confirmed) return;

    setActionId(institution._id);
    setError("");

    try {
      await api.patch(`/institutions/${institution._id}/approve`);
      await loadInstitutions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to approve institution."
      );
    } finally {
      setActionId("");
    }
  };

  const handleReject = async (event) => {
    event.preventDefault();

    if (!rejecting) return;

    setActionId(rejecting._id);
    setError("");

    try {
      await api.patch(`/institutions/${rejecting._id}/reject`, {
        reason: reason.trim()
      });

      setRejecting(null);
      setReason("");
      await loadInstitutions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reject institution."
      );
    } finally {
      setActionId("");
    }
  };

  if (authLoading) {
    return (
      <main className="admin-institutions">
        <style>{styles}</style>
        <div className="cc-loading">
          <div className="cc-loading-row">
            <span className="cc-spinner" />
            Loading your admin workspace...
          </div>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  const pendingCount = institutions.filter(
    (item) => getStatus(item) === "PENDING"
  ).length;

  const verifiedCount = institutions.filter(
    (item) => getStatus(item) === "VERIFIED"
  ).length;

  const rejectedCount = institutions.filter(
    (item) => getStatus(item) === "REJECTED"
  ).length;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredInstitutions = institutions.filter((item) =>
    [
      item.name,
      item.code,
      item.email,
      item.address,
      getStatus(item)
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(normalizedSearch)
      )
  );

  return (
    <main className="admin-institutions">
      <style>{styles}</style>

      <header className="cc-hero">
        <div className="cc-hero-content">
          <p className="cc-eyebrow">
            <ShieldCheck size={15} />
            CREDENTIALCHAIN / ADMINISTRATION
          </p>
          <h1>Institution Verification</h1>
          <p className="cc-subtitle">
            Review academic institutions, validate registration
            details, and maintain trust across the credential
            verification network.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
          <button
            type="button"
            className="cc-refresh"
            onClick={loadInstitutions}
            disabled={loading || Boolean(actionId)}
          >
            <RefreshCw
              size={16}
              className={loading ? "cc-refreshing" : ""}
            />
            Refresh
          </button>

          <div className="cc-hero-icon">
            <Landmark size={34} />
          </div>
        </div>
      </header>

      {error && (
        <div className="cc-alert" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <p className="cc-section-label">Verification overview</p>

      <section className="cc-stats">
        <article className="cc-stat">
          <div>
            <p className="cc-stat-label">Total institutions</p>
            <p className="cc-stat-number">{institutions.length}</p>
            <p className="cc-stat-note">All registered institutions</p>
          </div>
          <div className="cc-stat-icon blue">
            <Building2 />
          </div>
        </article>

        <article className="cc-stat">
          <div>
            <p className="cc-stat-label">Pending review</p>
            <p className="cc-stat-number">{pendingCount}</p>
            <p className="cc-stat-note">Awaiting administrator action</p>
          </div>
          <div className="cc-stat-icon amber">
            <Clock3 />
          </div>
        </article>

        <article className="cc-stat">
          <div>
            <p className="cc-stat-label">Verified institutions</p>
            <p className="cc-stat-number">{verifiedCount}</p>
            <p className="cc-stat-note">
              {rejectedCount} rejected application{rejectedCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="cc-stat-icon green">
            <CheckCircle2 />
          </div>
        </article>
      </section>

      {rejecting && (
        <form className="cc-form-panel" onSubmit={handleReject}>
          <div className="cc-form-heading">
            <div>
              <h2>Reject institution application</h2>
              <p>
                You are rejecting <strong>{rejecting.name}</strong>.
                Add a reason to help explain this decision.
              </p>
            </div>

            <button
              type="button"
              className="cc-close"
              aria-label="Close rejection form"
              onClick={() => {
                setRejecting(null);
                setReason("");
              }}
              disabled={Boolean(actionId)}
            >
              <X />
            </button>
          </div>

          <label className="cc-field-label" htmlFor="cc-rejection-reason">
            Rejection reason <span style={{ color: "#9aa4b5", fontWeight: 500 }}>(optional)</span>
          </label>

          <textarea
            id="cc-rejection-reason"
            className="cc-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="For example: The institution registration details could not be verified..."
            rows={4}
            maxLength={500}
          />

          <div className="cc-form-footer">
            <span>{reason.length}/500 characters</span>
            <div style={{ display: "flex", gap: 9 }}>
              <button
                type="button"
                className="cc-btn cc-btn-quiet"
                onClick={() => {
                  setRejecting(null);
                  setReason("");
                }}
                disabled={Boolean(actionId)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cc-btn cc-btn-danger"
                disabled={Boolean(actionId)}
              >
                <XCircle size={15} />
                {actionId ? "Processing..." : "Confirm rejection"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="cc-toolbar">
        <div>
          <h2>Registered institutions</h2>
          <p>Review institution details and manage verification status.</p>
        </div>
        <span className="cc-count">
          {filteredInstitutions.length} result{filteredInstitutions.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="cc-search-wrap">
        <Search size={17} />
        <input
          className="cc-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by institution name, code, email, or status..."
          aria-label="Search institutions"
        />
      </div>

      {loading && institutions.length === 0 ? (
        <div className="cc-empty">
          <div className="cc-empty-icon">
            <span className="cc-spinner" />
          </div>
          <h3>Loading institutions</h3>
          <p>Retrieving registered institutions and their verification statuses.</p>
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="cc-empty">
          <div className="cc-empty-icon">
            {search ? <Search /> : <Building2 />}
          </div>
          <h3>
            {search
              ? "No matching institutions"
              : "No institution applications yet"}
          </h3>
          <p>
            {search
              ? "Try a different search term or clear your search to see all institutions."
              : "New institution registrations will appear here when they submit an application."}
          </p>
          {search && (
            <button
              type="button"
              className="cc-btn cc-btn-quiet"
              style={{ marginTop: 17 }}
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <section className="cc-list" aria-label="Institution list">
          {filteredInstitutions.map((institution) => {
            const status = getStatus(institution);
            const busy = actionId === institution._id;

            return (
              <article className="cc-card" key={institution._id}>
                <div className="cc-card-top">
                  <div className="cc-org">
                    <div className="cc-org-icon">
                      <Building2 size={23} />
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <h3>{institution.name}</h3>
                      <span className="cc-code">
                        <Hash size={13} />
                        Institution code: {institution.code}
                      </span>
                    </div>
                  </div>

                  <span className={`cc-status ${status.toLowerCase()}`}>
                    {status === "VERIFIED" && <CheckCircle2 />}
                    {status === "PENDING" && <Clock3 />}
                    {status === "REJECTED" && <XCircle />}
                    {status}
                  </span>
                </div>

                <div className="cc-details">
                  <div className="cc-detail">
                    <Mail size={16} />
                    <div>
                      <span>Contact email</span>
                      <strong>{institution.email || "Not provided"}</strong>
                    </div>
                  </div>

                  <div className="cc-detail">
                    <MapPin size={16} />
                    <div>
                      <span>Address</span>
                      <strong>{institution.address || "Not provided"}</strong>
                    </div>
                  </div>

                  <div className="cc-detail">
                    <CalendarDays size={16} />
                    <div>
                      <span>Registration date</span>
                      <strong>
                        {institution.createdAt
                          ? new Date(institution.createdAt).toLocaleDateString(
                              undefined,
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              }
                            )
                          : "Unknown"}
                      </strong>
                    </div>
                  </div>
                </div>

                {status === "REJECTED" && institution.rejectionReason && (
                  <div className="cc-rejection-note">
                    <strong>Rejection reason:</strong>{" "}
                    {institution.rejectionReason}
                  </div>
                )}

                {status === "PENDING" ? (
                  <div className="cc-actions">
                    <button
                      type="button"
                      className="cc-btn cc-btn-primary"
                      onClick={() => handleApprove(institution)}
                      disabled={Boolean(actionId)}
                    >
                      {busy ? (
                        <span className="cc-spinner" />
                      ) : (
                        <ClipboardCheck size={15} />
                      )}
                      {busy ? "Processing..." : "Approve institution"}
                    </button>

                    <button
                      type="button"
                      className="cc-btn cc-btn-danger"
                      onClick={() => {
                        setRejecting(institution);
                        setReason("");
                      }}
                      disabled={Boolean(actionId)}
                    >
                      <XCircle size={15} />
                      Reject application
                    </button>
                  </div>
                ) : (
                  <div className="cc-actions">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        color: status === "VERIFIED" ? "#18835d" : "#9a6700",
                        fontSize: 12,
                        fontWeight: 650
                      }}
                    >
                      {status === "VERIFIED" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {status === "VERIFIED"
                        ? "Institution verification complete"
                        : "Application rejected"}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginTop: 24,
          padding: "14px 16px",
          border: "1px solid #e3eafa",
          borderRadius: 13,
          color: "#687895",
          background: "#f7f9ff",
          fontSize: 11,
          lineHeight: 1.7
        }}
      >
        <ShieldCheck size={17} style={{ flex: "0 0 17px", color: "#4169e1" }} />
        <p style={{ margin: 0 }}>
          <strong style={{ color: "#3a4b6b" }}>Administrative control:</strong>{" "}
          Only approve institutions after checking their registration
          information. Backend authorization must remain enabled for all
          institution-management operations.
        </p>
      </div>
    </main>
  );
}

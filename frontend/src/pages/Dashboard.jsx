
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileCheck,
  Clock,
  Activity,
  Building2,
  Users,
  AlertCircle
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [certificates, setCertificates] = useState([]);
  const [history, setHistory] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        if (user.role === "ADMIN") {
          const [certificateResponse, institutionResponse] =
            await Promise.all([
              api.get("/certificates"),
              api.get("/institutions")
            ]);

          if (cancelled) return;

          setCertificates(
            certificateResponse.data.certificates || []
          );

          setInstitutions(
            institutionResponse.data.institutions || []
          );
        } else if (user.role === "INSTITUTION") {
          const response = await api.get("/certificates");

          if (cancelled) return;

          setCertificates(response.data.certificates || []);
        } else if (user.role === "RECRUITER") {
          const response = await api.get("/verify/history");

          if (cancelled) return;

          setHistory(response.data.history || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return <p className="muted">Loading user information...</p>;
  }

  const activeCertificates = certificates.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const revokedCertificates = certificates.filter(
    (item) => item.status === "REVOKED"
  ).length;

  const pendingInstitutions = institutions.filter(
    (item) =>
      (item.verificationStatus ||
        (item.isVerified ? "VERIFIED" : "PENDING")) === "PENDING"
  ).length;

  const verifiedInstitutions = institutions.filter(
    (item) =>
      (item.verificationStatus ||
        (item.isVerified ? "VERIFIED" : "PENDING")) === "VERIFIED"
  ).length;

  let stats = [];

  if (user.role === "ADMIN") {
    stats = [
      {
        label: "Total Certificates",
        value: certificates.length,
        icon: FileCheck
      },
      {
        label: "Active Certificates",
        value: activeCertificates,
        icon: ShieldCheck
      },
      {
        label: "Pending Institutions",
        value: pendingInstitutions,
        icon: Clock
      },
      {
        label: "Verified Institutions",
        value: verifiedInstitutions,
        icon: Building2
      }
    ];
  } else if (user.role === "INSTITUTION") {
    stats = [
      {
        label: "Certificates Issued",
        value: certificates.length,
        icon: FileCheck
      },
      {
        label: "Active Certificates",
        value: activeCertificates,
        icon: ShieldCheck
      },
      {
        label: "Revoked Certificates",
        value: revokedCertificates,
        icon: Clock
      }
    ];
  } else {
    stats = [
      {
        label: "Checks Performed",
        value: history.length,
        icon: Activity
      },
      {
        label: "Verified",
        value: history.filter(
          (item) => item.result === "VERIFIED"
        ).length,
        icon: ShieldCheck
      },
      {
        label: "Not Matched",
        value: history.filter(
          (item) => item.result === "NOT_MATCHED"
        ).length,
        icon: FileCheck
      }
    ];
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Welcome, {user.name}</h1>
          <p className="muted">
            {user.role === "ADMIN" &&
              "Manage institutions, certificates, and platform integrity."}

            {user.role === "INSTITUTION" &&
              "Manage and monitor your academic credentials."}

            {user.role === "RECRUITER" &&
              "Verify academic credentials and review verification history."}
          </p>
        </div>

        <span className="role-badge">{user.role}</span>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p className="muted">Loading dashboard statistics...</p>
      ) : (
        <div className="stats-grid">
          {stats.map(({ label, value, icon: Icon }) => (
            <div className="stat-card" key={label}>
              <div className="stat-top">
                <span>{label}</span>
                <Icon size={21} />
              </div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      )}

      {user.role === "ADMIN" && (
        <section className="panel">
          <h2>Institution Management</h2>
          <p className="muted">
            Review institution registration requests before allowing
            institutions to issue certificates.
          </p>

          <div className="security-note">
            <Building2 size={22} />
            <div>
              <strong>
                {pendingInstitutions} institution(s) awaiting review
              </strong>
              <p>
                {verifiedInstitutions} institution(s) are verified.
                Review pending applications before approving access.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              (window.location.href = "/admin/institutions")
            }
          >
            Manage Institutions
          </button>
        </section>
      )}

      {user.role === "INSTITUTION" && (
        <section className="panel">
          <h2>Certificate Management</h2>
          <p className="muted">
            View your certificate records and monitor their current status.
          </p>

          <div className="security-note">
            <ShieldCheck size={22} />
            <div>
              <strong>Document integrity verification</strong>
              <p>
                Certificates use SHA-256 fingerprints to help detect
                modified documents and revoked records.
              </p>
            </div>
          </div>
        </section>
      )}

      {user.role === "RECRUITER" && (
        <section className="panel">
          <h2>Verification Activity</h2>
          <p className="muted">
            Review previous certificate checks and their recorded results.
          </p>

          <div className="security-note">
            <Activity size={22} />
            <div>
              <strong>Verification history</strong>
              <p>
                A matching file fingerprint alone does not establish
                authenticity unless the associated certificate record
                and its current status are also checked.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="panel">
        <h2>About CredentialChain</h2>
        <p className="muted">
          CredentialChain helps institutions issue academic credentials
          and enables recruiters to check registered certificates for
          integrity and revocation status.
        </p>

        <div className="security-note">
          <ShieldCheck size={22} />
          <div>
            <strong>Tamper-evident verification</strong>
            <p>
              Each verification compares the uploaded document with
              its registered fingerprint and checks whether the
              certificate has been revoked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

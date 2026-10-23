import { useState } from "react";
import { Upload, ShieldCheck, XCircle, AlertTriangle } from "lucide-react";
import api from "../services/api";

export default function VerifyCertificate() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!file || file.type !== "application/pdf") {
      setError("Select a valid PDF certificate.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The PDF must be smaller than 5 MB.");
      return;
    }

    const data = new FormData();
    data.append("certificate", file);

    setLoading(true);

    try {
      const response = await api.post("/verify", data);
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const resultStyles = {
    VERIFIED: {
      icon: ShieldCheck,
      className: "result-verified",
      title: "Certificate verified"
    },
    NOT_MATCHED: {
      icon: XCircle,
      className: "result-unmatched",
      title: "No matching certificate"
    },
    REVOKED: {
      icon: AlertTriangle,
      className: "result-revoked",
      title: "Certificate revoked"
    }
  };

  const outcome = result ? resultStyles[result.result] : null;
  const ResultIcon = outcome?.icon;

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">AUTHENTICITY CHECK</p>
          <h1>Verify certificate</h1>
          <p className="muted">
            Compare a PDF with registered academic records.
          </p>
        </div>
      </div>

      <form className="panel verify-panel" onSubmit={verify}>
        <div className="verify-icon">
          <ShieldCheck size={32} />
        </div>

        <h2>Upload academic certificate</h2>
        <p className="muted">
          Select the original PDF for an exact file-integrity check.
        </p>

        <label className="upload-box">
          <Upload size={30} />
          <strong>{file ? file.name : "Choose PDF certificate"}</strong>
          <span>PDF format · Maximum 5 MB</span>
          <input
            hidden
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => {
              setFile(event.target.files?.[0] || null);
              setResult(null);
              setError("");
            }}
          />
        </label>

        {error && <div className="alert">{error}</div>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Checking certificate..." : "Verify certificate"}
        </button>
      </form>

      {result && outcome && (
        <section className={`result-card ${outcome.className}`}>
          <ResultIcon size={36} />
          <div>
            <h2>{outcome.title}</h2>
            <p>{result.message}</p>

            {result.certificate && (
              <div className="result-details">
                <p>
                  <strong>Student:</strong>{" "}
                  {result.certificate.studentName}
                </p>
                <p>
                  <strong>Degree:</strong>{" "}
                  {result.certificate.degree}
                </p>
                <p>
                  <strong>Graduation year:</strong>{" "}
                  {result.certificate.graduationYear}
                </p>
                <p>
                  <strong>Institution:</strong>{" "}
                  {result.certificate.institution}
                </p>
                <p>
                  <strong>Record status:</strong>{" "}
                  {result.certificate.status}
                </p>
              </div>
            )}

            <p className="muted">
              Verification ID: {result.verificationId}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
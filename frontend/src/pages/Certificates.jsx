import { useEffect, useState } from "react";
import { Upload, FileText } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Certificates() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    studentName: "",
    rollNumber: "",
    degree: "",
    graduationYear: new Date().getFullYear()
  });

  const [file, setFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCertificates() {
    const response = await api.get("/certificates");
    setCertificates(response.data.certificates || []);
  }

  useEffect(() => {
    loadCertificates().catch(() => {
      setError("Unable to load certificates.");
    });
  }, []);


const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage("");
  setError("");

  if (!file) {
    setError("Please select a certificate PDF.");
    return;
  }

  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    setError("Please select a valid PDF file.");
    return;
  }

  const data = new FormData();
  data.append("studentName", form.studentName);
  data.append("rollNumber", form.rollNumber);
  data.append("degree", form.degree);
  data.append("graduationYear", String(form.graduationYear));
  data.append("certificate", file, file.name);

  console.log("Upload filename:", file.name);
  console.log("FormData file:", data.get("certificate"));

  setLoading(true);

  try {
    const response = await api.post("/certificates", data);

    setMessage(response.data.message || "Certificate registered successfully.");
    setFile(null);

    setForm({
      studentName: "",
      rollNumber: "",
      degree: "",
      graduationYear: new Date().getFullYear()
    });

    event.target.reset();
    await loadCertificates();
  } catch (err) {
    console.error("Certificate registration error:", err.response?.data || err);

    setError(
      err.response?.data?.message ||
      "Certificate registration failed."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACADEMIC RECORDS</p>
          <h1>Certificates</h1>
          <p className="muted">
            Register and manage institutional certificate records.
          </p>
        </div>
      </div>

      {user.role === "INSTITUTION" && (
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>Register certificate</h2>

          {message && <div className="success-alert">{message}</div>}
          {error && <div className="alert">{error}</div>}

          <div className="form-grid">
            <div>
              <label>Student name</label>
              <input
                required
                value={form.studentName}
                onChange={(e) =>
                  setForm({ ...form, studentName: e.target.value })
                }
              />
            </div>

            <div>
              <label>Roll number</label>
              <input
                required
                value={form.rollNumber}
                onChange={(e) =>
                  setForm({ ...form, rollNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label>Degree</label>
              <input
                required
                placeholder="Bachelor of Engineering"
                value={form.degree}
                onChange={(e) =>
                  setForm({ ...form, degree: e.target.value })
                }
              />
            </div>

            <div>
              <label>Graduation year</label>
              <input
                required
                type="number"
                min="1950"
                max={new Date().getFullYear() + 10}
                value={form.graduationYear}
                onChange={(e) =>
                  setForm({ ...form, graduationYear: e.target.value })
                }
              />
            </div>
          </div>

          <label className="upload-box">
            <Upload size={25} />
            <strong>{file ? file.name : "Choose original certificate PDF"}</strong>
            <span>Maximum file size: 5 MB</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? "Registering..." : "Register certificate"}
          </button>
        </form>
      )}

      <section className="panel">
        <h2>Registered certificates</h2>

        {certificates.length === 0 ? (
          <p className="muted">No certificates found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll number</th>
                  <th>Degree</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((item) => (
                  <tr key={item._id}>
                    <td>{item.studentName}</td>
                    <td>{item.rollNumber}</td>
                    <td>{item.degree}</td>
                    <td>
                      <span
                        className={`status ${item.status === "ACTIVE" ? "status-active" : "status-revoked"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
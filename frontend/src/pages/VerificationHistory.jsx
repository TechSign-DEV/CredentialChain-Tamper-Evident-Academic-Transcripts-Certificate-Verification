import { useEffect, useState } from "react";
import api from "../services/api";

export default function VerificationHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/verify/history")
      .then((response) => {
        setHistory(response.data.history || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Could not load history."
        );
      });
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACTIVITY</p>
          <h1>Verification history</h1>
          <p className="muted">Review your recent verification checks.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        {history.length === 0 ? (
          <p className="muted">No verification attempts yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Result</th>
                  <th>Student</th>
                  <th>Degree</th>
                  <th>Verified at</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="status">{item.result}</span>
                    </td>
                    <td>{item.certificateId?.studentName || "—"}</td>
                    <td>{item.certificateId?.degree || "—"}</td>
                    <td>
                      {new Date(item.verifiedAt).toLocaleString()}
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
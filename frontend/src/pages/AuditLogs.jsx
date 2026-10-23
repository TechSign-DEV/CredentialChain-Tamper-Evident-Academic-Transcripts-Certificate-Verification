import { useEffect, useState } from "react";
import api from "../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/audit-logs")
      .then((response) => {
        setLogs(response.data.logs || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Could not load audit logs."
        );
      });
  }, []);

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM SECURITY</p>
          <h1>Audit logs</h1>
          <p className="muted">
            Review certificate registration, verification and revocation events.
          </p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        {logs.length === 0 ? (
          <p className="muted">No audit events found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => (
                  <tr key={item._id}>
                    <td>{item.action}</td>
                    <td>
                      {item.actorId?.name || "Unknown"}
                      <br />
                      <span className="muted">
                        {item.actorId?.role || ""}
                      </span>
                    </td>
                    <td>{item.details}</td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
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
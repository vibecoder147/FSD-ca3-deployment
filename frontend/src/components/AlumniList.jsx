import { useMemo, useState } from "react";

// Reusable presentational component: props in, markup out
export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default function AlumniList({ alumni }) {
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("fullName");

  // Recalculated only when the data, filter or sort changes
  const visible = useMemo(() => {
    const filtered = filter === "all" ? alumni : alumni.filter((a) => a.status === filter);
    return [...filtered].sort((a, b) =>
      typeof a[sortKey] === "number" ? a[sortKey] - b[sortKey] : String(a[sortKey]).localeCompare(String(b[sortKey]))
    );
  }, [alumni, filter, sortKey]);

  return (
    <section className="panel">
      <div className="toolbar">
        <label>Status
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <label>Sort by
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="fullName">Name</option>
            <option value="gradYear">Graduation year</option>
          </select>
        </label>
        <span>{visible.length} record(s)</span>
      </div>

      {visible.length === 0 ? (
        <p>No alumni match this filter.</p>
      ) : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Year</th><th>Status</th></tr></thead>
          <tbody>
            {visible.map((a) => (
              <tr key={a.id}>
                <td>{a.fullName}</td>
                <td>{a.email}</td>
                <td>{a.gradYear}</td>
                <td><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

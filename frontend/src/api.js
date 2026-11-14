const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
  return data;
}

export const fetchAlumni = () => request("/alumni");
export const createAlumni = (record) => request("/alumni", { method: "POST", body: JSON.stringify(record) });

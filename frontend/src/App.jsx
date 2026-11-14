import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import AlumniForm from "./components/AlumniForm.jsx";
import AlumniList from "./components/AlumniList.jsx";
import { fetchAlumni, createAlumni } from "./api.js";

export default function App() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect runs once on mount; the flag stops state updates after unmount
  useEffect(() => {
    let active = true;
    fetchAlumni()
      .then((records) => active && setAlumni(records))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const handleCreate = async (values) => {
    const saved = await createAlumni(values);
    setAlumni((prev) => [...prev, saved]);
  };

  return (
    <>
      <header>
        <h1>Alumni Directory</h1>
        <nav>
          <NavLink to="/" end>Directory</NavLink> | <NavLink to="/add">Add Alumni</NavLink>
        </nav>
      </header>
      <main>
        {loading && <p>Loading records...</p>}
        {error && <p className="error">Could not load records: {error}</p>}
        <Routes>
          <Route path="/" element={<AlumniList alumni={alumni} />} />
          <Route path="/add" element={<AlumniForm onSubmit={handleCreate} />} />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </main>
    </>
  );
}

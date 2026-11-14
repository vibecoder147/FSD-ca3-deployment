import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMPTY = { fullName: "", email: "", gradYear: "", status: "active" };

function validate({ fullName, email, gradYear }) {
  const maxYear = new Date().getFullYear() + 5;
  const errors = {};
  if (fullName.trim().length < 3) errors.fullName = "Name must be at least 3 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email.";
  const year = Number(gradYear);
  if (!Number.isInteger(year) || year < 1950 || year > maxYear) errors.gradYear = `Year must be 1950-${maxYear}.`;
  return errors;
}

// Controlled form: every field value lives in state
export default function AlumniForm({ onSubmit }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const record = { ...values, fullName: values.fullName.trim(), email: values.email.trim() };
      await onSubmit({ ...record, gradYear: Number(values.gradYear) });
      navigate("/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, type = "text") => (
    <label>
      {label}
      <input name={name} type={type} value={values[name]} onChange={handleChange} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </label>
  );

  return (
    <section className="panel">
      <h2>Add Alumni</h2>
      <form onSubmit={handleSubmit} noValidate>
        {field("Full name", "fullName")}
        {field("Email", "email")}
        {field("Graduation year", "gradYear", "number")}
        <label>
          Status
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        {serverError && <p className="error">{serverError}</p>}
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save record"}</button>
      </form>
    </section>
  );
}

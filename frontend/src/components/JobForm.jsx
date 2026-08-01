import { Save } from "lucide-react";
import { useState } from "react";

const emptyJob = {
  title: "",
  description: "",
  location: "",
  employment_type: "Full-time",
  status: "OPEN",
};

export default function JobForm({ initialValue, onSubmit, submitting }) {
  const [form, setForm] = useState(initialValue || emptyJob);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input className="form-field" name="title" value={form.title} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Location</span>
          <input className="form-field" name="location" value={form.location} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Employment type</span>
          <select className="form-field" name="employment_type" value={form.employment_type} onChange={updateField}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select className="form-field" name="status" value={form.status} onChange={updateField}>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </label>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          className="form-field min-h-44"
          name="description"
          value={form.description}
          onChange={updateField}
          required
        />
      </label>
      <button className="btn-primary" disabled={submitting}>
        <Save className="h-4 w-4" />
        {submitting ? "Saving" : "Save job"}
      </button>
    </form>
  );
}

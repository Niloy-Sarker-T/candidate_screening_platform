import { Send } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createApplication } from "../api/applications";
import { getErrorMessage } from "../api/client";
import { fetchJob } from "../api/jobs";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { useAsync } from "../hooks/useAsync";

export default function ApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { data: job, loading, error } = useAsync(() => fetchJob(jobId), [jobId]);
  const [form, setForm] = useState({ name: "", email: "", resume_url: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSuccess("");
    try {
      const application = await createApplication({ ...form, job_id: Number(jobId) });
      setSuccess(`Application submitted. Tracking ID: ${application.id}`);
      setTimeout(() => navigate(`/track?applicationId=${application.id}`), 800);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Apply"
        title={job ? job.title : "Job application"}
        description={job ? `${job.location} • ${job.employment_type}` : "Submit your candidate profile."}
        actions={<Link className="btn-secondary" to="/">Back to jobs</Link>}
      />

      {loading && <Loading label="Loading job" />}
      {error && <Alert type="error">{error}</Alert>}
      <Alert type="success">{success}</Alert>
      <Alert type="error">{submitError}</Alert>

      {job && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Role details</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{job.description}</p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input className="form-field" name="name" value={form.name} onChange={updateField} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input className="form-field" type="email" name="email" value={form.email} onChange={updateField} required />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Resume URL</span>
              <input
                className="form-field"
                type="url"
                name="resume_url"
                value={form.resume_url}
                onChange={updateField}
                placeholder="https://example.com/resume.pdf"
                required
              />
            </label>
            <button className="btn-primary" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? "Submitting" : "Submit application"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

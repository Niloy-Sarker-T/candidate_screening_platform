import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { fetchApplication } from "../api/applications";
import { getErrorMessage } from "../api/client";
import Alert from "../components/Alert";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

export default function TrackStatus() {
  const [params, setParams] = useSearchParams();
  const initialId = useMemo(() => params.get("applicationId") || "", [params]);
  const [applicationId, setApplicationId] = useState(initialId);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!applicationId) return;
    setLoading(true);
    setError("");
    setApplication(null);
    try {
      const result = await fetchApplication(applicationId);
      setApplication(result);
      setParams({ applicationId });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Candidate"
        title="Track application"
        description="Enter your application tracking ID to see the latest screening status."
      />

      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <input
          className="form-field"
          inputMode="numeric"
          placeholder="Application ID"
          value={applicationId}
          onChange={(event) => setApplicationId(event.target.value)}
        />
        <button className="btn-primary" disabled={loading}>
          <Search className="h-4 w-4" />
          {loading ? "Checking" : "Check"}
        </button>
      </form>

      <Alert type="error">{error}</Alert>

      {application && (
        <section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Application #{application.id}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{application.job.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{application.candidate.name}</p>
            </div>
            <StatusBadge value={application.status} />
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-900">{application.candidate.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Applied on</dt>
              <dd className="mt-1 text-slate-900">{new Date(application.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}

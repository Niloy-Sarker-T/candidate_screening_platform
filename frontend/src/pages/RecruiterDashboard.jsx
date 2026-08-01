import { Eye, FilePlus2, Pencil, Search, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { closeJob, fetchJobs } from "../api/jobs";
import { getErrorMessage } from "../api/client";
import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";

export default function RecruiterDashboard() {
  const [filters, setFilters] = useState({ search: "", status: "", sort: "newest" });
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const { data: jobs, loading, error, refetch } = useAsync(
    () => fetchJobs({ ...filters, status: filters.status || undefined, search: filters.search || undefined }),
    [filters],
  );

  const stats = {
    total: jobs?.length || 0,
    open: jobs?.filter((job) => job.status === "OPEN").length || 0,
    applications: jobs?.reduce((sum, job) => sum + job.application_count, 0) || 0,
  };

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  async function handleClose(job) {
    if (!window.confirm(`Close "${job.title}"? Candidates will no longer be able to apply.`)) {
      return;
    }

    setMessage("");
    setActionError("");
    try {
      await closeJob(job.id);
      setMessage("Job closed successfully.");
      refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruiter"
        title="Dashboard"
        description="Manage jobs, review applications, and move candidates through the screening pipeline."
        actions={
          <Link className="btn-primary" to="/recruiter/jobs/new">
            <FilePlus2 className="h-4 w-4" />
            Create job
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total jobs" value={stats.total} />
        <Stat label="Open jobs" value={stats.open} />
        <Stat label="Applications" value={stats.applications} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            className="form-field"
            name="search"
            placeholder="Search jobs"
            value={filters.search}
            onChange={updateFilter}
          />
          <select className="form-field" name="status" value={filters.status} onChange={updateFilter}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select className="form-field" name="sort" value={filters.sort} onChange={updateFilter}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title</option>
          </select>
          <button className="btn-secondary" onClick={refetch}>
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <Alert type="success">{message}</Alert>
      <Alert type="error">{actionError || error}</Alert>
      {loading && <Loading label="Loading jobs" />}

      {!loading && jobs?.length === 0 && (
        <EmptyState
          title="No jobs found"
          message="Create the first job or adjust your filters."
          action={<Link className="btn-primary" to="/recruiter/jobs/new">Create job</Link>}
        />
      )}

      {!loading && jobs?.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Job</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Applications</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <Td>
                      <div>
                        <p className="font-semibold text-slate-950">{job.title}</p>
                        <p className="text-sm text-slate-500">{job.location}</p>
                      </div>
                    </Td>
                    <Td>{job.employment_type}</Td>
                    <Td><StatusBadge value={job.status} /></Td>
                    <Td>{job.application_count}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-2">
                        <Link className="btn-secondary" to={`/recruiter/jobs/${job.id}/applications`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link className="btn-secondary" to={`/recruiter/jobs/${job.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button className="btn-danger" disabled={job.status === "CLOSED"} onClick={() => handleClose(job)}>
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-4 text-sm text-slate-700">{children}</td>;
}

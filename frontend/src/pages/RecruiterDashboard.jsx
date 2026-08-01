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
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    status: "",
    sort: "newest",
    page: 1,
    size: 10,
  });
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const { data: jobs, loading, error, refetch } = useAsync(
    () =>
      fetchJobs({
        ...filters,
        status: filters.status || undefined,
        search: filters.search || undefined,
        location: filters.location || undefined,
      }),
    [filters],
  );
  const jobItems = jobs?.items || [];

  const stats = {
    total: jobs?.total || 0,
    open: jobItems.filter((job) => job.status === "OPEN").length,
    applications: jobItems.reduce((sum, job) => sum + job.application_count, 0),
  };

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  }

  function changePage(nextPage) {
    setFilters((current) => ({ ...current, page: nextPage }));
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
        <div className="grid gap-3 md:grid-cols-[1fr_180px_160px_160px_auto]">
          <input
            className="form-field"
            name="search"
            placeholder="Search jobs"
            value={filters.search}
            onChange={updateFilter}
          />
          <input
            className="form-field"
            name="location"
            placeholder="Location"
            value={filters.location}
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

      {!loading && jobItems.length === 0 && (
        <EmptyState
          title="No jobs found"
          message="Create the first job or adjust your filters."
          action={<Link className="btn-primary" to="/recruiter/jobs/new">Create job</Link>}
        />
      )}

      {!loading && jobItems.length > 0 && (
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
                {jobItems.map((job) => (
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
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Page {jobs.page} of {Math.max(1, Math.ceil(jobs.total / jobs.size))} · {jobs.total} total jobs
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={jobs.page <= 1}
                onClick={() => changePage(jobs.page - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary"
                disabled={jobs.page >= Math.ceil(jobs.total / jobs.size)}
                onClick={() => changePage(jobs.page + 1)}
              >
                Next
              </button>
            </div>
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

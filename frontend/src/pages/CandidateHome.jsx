import { MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { fetchOpenJobs } from "../api/jobs";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";

export default function CandidateHome() {
  const [search, setSearch] = useState("");
  const { data: jobs, loading, error, refetch } = useAsync(
    () => fetchOpenJobs({ search: search || undefined }),
    [search],
  );

  function handleSearch(event) {
    event.preventDefault();
    refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Candidate"
        title="Open roles"
        description="Browse current openings and submit your application in a few focused steps."
      />

      <form onSubmit={handleSearch} className="flex max-w-xl gap-2">
        <input
          className="form-field"
          placeholder="Search by title, skill, or location"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn-secondary" aria-label="Search jobs">
          <Search className="h-4 w-4" />
        </button>
      </form>

      {error && <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {loading && <Loading label="Loading open jobs" />}

      {!loading && jobs?.length === 0 && (
        <EmptyState title="No open jobs" message="There are no open roles matching your search right now." />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs?.map((job) => (
          <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{job.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </p>
              </div>
              <StatusBadge value={job.status} />
            </div>
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">{job.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {job.employment_type}
              </span>
              <Link className="btn-primary" to={`/apply/${job.id}`}>
                Apply
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

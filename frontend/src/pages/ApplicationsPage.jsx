import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import { updateApplicationStatus } from "../api/applications";
import { getErrorMessage } from "../api/client";
import { fetchJob, fetchJobApplications } from "../api/jobs";
import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAsync } from "../hooks/useAsync";

const statuses = ["Applied", "Screening", "Interview", "Rejected", "Hired"];

export default function ApplicationsPage() {
  const { jobId } = useParams();
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const jobState = useAsync(() => fetchJob(jobId), [jobId]);
  const applicationsState = useAsync(() => fetchJobApplications(jobId), [jobId]);

  async function handleStatusChange(applicationId, status) {
    setMessage("");
    setActionError("");
    try {
      await updateApplicationStatus(applicationId, status);
      setMessage("Candidate status updated.");
      applicationsState.refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  }

  const job = jobState.data;
  const applications = applicationsState.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruiter"
        title={job ? `${job.title} applications` : "Applications"}
        description={job ? `${job.application_count} candidate${job.application_count === 1 ? "" : "s"} in pipeline` : ""}
        actions={
          <Link className="btn-secondary" to="/recruiter">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        }
      />

      {(jobState.loading || applicationsState.loading) && <Loading label="Loading applications" />}
      <Alert type="success">{message}</Alert>
      <Alert type="error">{actionError || jobState.error || applicationsState.error}</Alert>

      {!applicationsState.loading && applications?.length === 0 && (
        <EmptyState title="No applications yet" message="Candidates who apply to this role will appear here." />
      )}

      {!applicationsState.loading && applications?.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Candidate</Th>
                  <Th>Resume</Th>
                  <Th>Status</Th>
                  <Th>Applied</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <Td>
                      <div>
                        <p className="font-semibold text-slate-950">{application.candidate.name}</p>
                        <p className="text-sm text-slate-500">{application.candidate.email}</p>
                      </div>
                    </Td>
                    <Td>
                      <a
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-blue-700"
                        href={application.resume_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Resume <ExternalLink className="h-4 w-4" />
                      </a>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge value={application.status} />
                        <select
                          className="form-field max-w-40"
                          value={application.status}
                          onChange={(event) => handleStatusChange(application.id, event.target.value)}
                        >
                          {statuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </Td>
                    <Td>{new Date(application.created_at).toLocaleDateString()}</Td>
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

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-4 text-sm text-slate-700">{children}</td>;
}

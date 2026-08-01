import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createJob, fetchJob, updateJob } from "../api/jobs";
import { getErrorMessage } from "../api/client";
import Alert from "../components/Alert";
import JobForm from "../components/JobForm";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { useAsync } from "../hooks/useAsync";

export default function JobEditor() {
  const { jobId } = useParams();
  const isEditing = Boolean(jobId);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: job, loading, error } = useAsync(
    () => (isEditing ? fetchJob(jobId) : Promise.resolve(null)),
    [jobId, isEditing],
  );

  async function handleSubmit(payload) {
    setSubmitting(true);
    setSubmitError("");
    try {
      if (isEditing) {
        await updateJob(jobId, payload);
      } else {
        await createJob(payload);
      }
      navigate("/recruiter");
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const initialValue = job
    ? {
        title: job.title,
        description: job.description,
        location: job.location,
        employment_type: job.employment_type,
        status: job.status,
      }
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruiter"
        title={isEditing ? "Edit job" : "Create job"}
        description="Keep role details clear so candidates understand the opportunity before applying."
        actions={
          <Link className="btn-secondary" to="/recruiter">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        }
      />
      {loading && isEditing && <Loading label="Loading job" />}
      <Alert type="error">{error || submitError}</Alert>
      {(!isEditing || initialValue) && (
        <JobForm initialValue={initialValue} onSubmit={handleSubmit} submitting={submitting} />
      )}
    </div>
  );
}

import { api } from "./client";

export async function fetchJobs(params = {}) {
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function fetchOpenJobs(params = {}) {
  const { data } = await api.get("/jobs/open", { params });
  return data;
}

export async function fetchJob(id) {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}

export async function createJob(payload) {
  const { data } = await api.post("/jobs", payload);
  return data;
}

export async function updateJob(id, payload) {
  const { data } = await api.put(`/jobs/${id}`, payload);
  return data;
}

export async function closeJob(id) {
  const { data } = await api.patch(`/jobs/${id}/close`);
  return data;
}

export async function fetchJobApplications(id) {
  const { data } = await api.get(`/jobs/${id}/applications`);
  return data;
}

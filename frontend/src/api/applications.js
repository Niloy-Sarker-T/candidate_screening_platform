import { api } from "./client";

export function getApplicationsExportUrl(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return `${api.defaults.baseURL}/applications/export${query ? `?${query}` : ""}`;
}

export async function fetchApplications(params = {}) {
  const { data } = await api.get("/applications", { params });
  return data;
}

export async function createApplication(payload) {
  const { data } = await api.post("/applications", payload);
  return data;
}

export async function fetchApplication(id) {
  const { data } = await api.get(`/applications/${id}`);
  return data;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/applications/${id}`, { status });
  return data;
}

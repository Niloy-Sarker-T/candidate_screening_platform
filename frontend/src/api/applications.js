import { api } from "./client";

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

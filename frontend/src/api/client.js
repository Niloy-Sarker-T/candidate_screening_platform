import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => `${item.loc?.slice(1).join(".") || "field"}: ${item.msg}`)
      .join(", ");
  }

  return detail || error.message || "Something went wrong";
}

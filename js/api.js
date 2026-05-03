export const API_BASE = "https://v2.api.noroff.dev";
export const API_KEY = "20330767-b4ca-44ce-a43f-9daa32182147";

export async function fetchData(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Something went wrong");
  }

  return data;
}

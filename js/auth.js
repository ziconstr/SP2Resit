import { API_BASE, fetchData } from "/js/api.js";

export async function register(name, email, password) {
  const data = await fetchData(`${API_BASE}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return data;
}

export async function login(email, password) {
  const data = await fetchData(`${API_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.data.accessToken);
  localStorage.setItem("profile", JSON.stringify(data.data));

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
  window.location.href = "/index.html";
}

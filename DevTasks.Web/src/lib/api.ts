const BASE_URL = "http://localhost:5000";

async function request(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Request failed");
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (url: string) => request(url, { method: "GET" }),
  post: (url: string, data: any) =>
    request(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data: any) =>
    request(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => request(url, { method: "DELETE" }),
};

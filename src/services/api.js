import { mockRequest } from "./mockStore";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export const isDemoMode = !APPS_SCRIPT_URL;

export async function apiRequest(action, payload = {}, session = {}) {
  if (isDemoMode) return mockRequest(action, payload);

  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action,
      payload,
      idToken: session.idToken,
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error || "Không thể gọi Apps Script API");
  }
  return data.data;
}

export function getGoogleClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID;
}

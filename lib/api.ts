import type { Camper, CamperPage, Filters, Review } from "./types";

export const API_URL = "https://campers-api.goit.study";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function getCampers(page: number, filters: Filters) {
  const params = new URLSearchParams({ page: String(page), perPage: "4" });
  Object.entries(filters).forEach(
    ([key, value]) => value && params.set(key, value),
  );
  return apiFetch<CamperPage>(`/campers?${params}`);
}

export const getCamper = (id: string) => apiFetch<Camper>(`/campers/${id}`);
export const getReviews = (id: string) =>
  apiFetch<Review[]>(`/campers/${id}/reviews`);
export const createBooking = (
  id: string,
  data: { name: string; email: string },
) =>
  apiFetch<{ message: string }>(`/campers/${id}/booking-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

import { config } from '../data/config';
import { Message, Ride, RideDraft } from '../types';
export const serviceConnected = Boolean(config.apiBaseUrl);
async function request<T>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  if (!serviceConnected) {
    throw new Error(
      'The live service has not been connected. Your information is saved on this device only.',
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(
        'The service could not complete your request. Please try again.',
      );
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
export const rideApi = {
  create: (draft: RideDraft) => request<Ride>('/rides', 'POST', draft),
  update: (id: string, draft: RideDraft) =>
    request<Ride>(`/rides/${encodeURIComponent(id)}`, 'PATCH', draft),
  cancel: (id: string) =>
    request<Ride>(`/rides/${encodeURIComponent(id)}/cancel`, 'POST'),
  get: (id: string) => request<Ride>(`/rides/${encodeURIComponent(id)}`),
};
export const supportApi = {
  send: (text: string, clientId: string) =>
    request<{ requestId: string }>('/support/requests', 'POST', {
      text,
      clientId,
    }),
  replies: (id: string) =>
    request<Message[]>(`/support/requests/${encodeURIComponent(id)}/messages`),
};

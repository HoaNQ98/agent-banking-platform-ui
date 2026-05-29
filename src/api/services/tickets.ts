import { APIException } from '../client';
import { getAuthHeaders } from '../client';
import type { ListTicketsParams, ListTicketsResponse, EmailTicket } from '../types';

const getEmailApiUrl = (path: string): string => {
  const base = import.meta.env.VITE_EMAIL_API_BASE_URL || 'http://localhost:9000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api/v1${cleanPath}`;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let detail = 'An error occurred';
    try {
      const err = await response.json();
      detail = err.detail || err.message || detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new APIException(response.status, detail);
  }
  return response.json() as Promise<T>;
};

export const TicketService = {
  async listTickets(params: ListTicketsParams = {}): Promise<ListTicketsResponse> {
    const query = new URLSearchParams();
    if (params.page != null) query.set('page', String(params.page));
    if (params.size != null) query.set('size', String(params.size));
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.priority) query.set('priority', params.priority);

    const url = `${getEmailApiUrl('/tickets')}?${query.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    });
    return handleResponse<ListTicketsResponse>(response);
  },

  async getTicket(ticketId: string): Promise<{ status: string; data: EmailTicket }> {
    const url = getEmailApiUrl(`/tickets/${ticketId}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    });
    return handleResponse<{ status: string; data: EmailTicket }>(response);
  },
};

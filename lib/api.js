"use client";

import { signOut } from "next-auth/react";

const API_BASE = '/api';

async function fetcher(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('API Error');
  return res.json();
}

export const apiClient = {
  auth: {
    me: async () => {
       const res = await fetch('/api/auth/session');
       const session = await res.json();
       if (!session || !Object.keys(session).length) throw new Error("Not authenticated");
       return session.user;
    },
    logout: () => signOut({ callbackUrl: '/' }),
  },
  entities: new Proxy({}, {
    get: (_, entity) => ({
      list: (sort, limit) => fetcher(`/entities/${entity}?sort=${sort || ''}&limit=${limit || ''}`),
      paginate: (page, limit, sort, query) => {
          const q = query ? `&query=${JSON.stringify(query)}` : '';
          return fetcher(`/entities/${entity}?page=${page}&limit=${limit}&sort=${sort || ''}${q}`);
      },
      filter: (query, sort, limit) => fetcher(`/entities/${entity}?query=${JSON.stringify(query)}&sort=${sort || ''}&limit=${limit || ''}`),
      create: (data) => fetcher(`/entities/${entity}`, { method: 'POST', body: JSON.stringify(data) }),
      update: (id, data) => fetcher(`/entities/${entity}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
      delete: (id) => fetcher(`/entities/${entity}/${id}`, { method: 'DELETE' }),
    })
  }),
  integrations: {
    Core: {
      SendEmail: (data) => fetcher('/integrations/email', { method: 'POST', body: JSON.stringify(data) }),
    }
  }
};

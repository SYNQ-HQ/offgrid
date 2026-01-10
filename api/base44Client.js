"use client";

import { useSession, signOut, signIn } from "next-auth/react";

const API_BASE = '/api';

async function fetcher(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
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

// We wrap NextAuth in a compatibility layer to match the old base44.auth.me() style
// or we just encourage using useSession() directly in new code.
// For now, let's keep this as a helper for API calls (entities)
export const base44 = {
  auth: {
    // This function is now less useful client-side because of hooks, 
    // but we can make it return the session if needed or just use the hook.
    // We'll leave it to fail or warn, encouraging refactor to useSession
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
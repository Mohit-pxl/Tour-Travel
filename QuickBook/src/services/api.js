// ─────────────────────────────────────────────────────────────────────────────
//  api.js — API Service
//
//  A simple helper to call the backend API.
//  It automatically attaches the Clerk auth token to every request,
//  so the backend knows who is making the call.
//
//  Usage in a component:
//    import { apiFetch } from '../services/api';
//    const data = await apiFetch('/tours', { getToken });
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Makes an authenticated fetch request to the backend.
 *
 * @param {string}   endpoint  - API path, e.g. '/bookings'
 * @param {Function} getToken  - Clerk's getToken function from useAuth()
 * @param {object}   options   - Optional fetch options (method, body, etc.)
 * @returns {Promise<object>}  - Parsed JSON response
 */
export const apiFetch = async (endpoint, getToken, options = {}) => {
  // Get the Clerk session token (JWT)
  const token = await getToken();

  // Build the full URL
  const url = `${API_URL}${endpoint}`;

  // Merge headers — always send the auth token
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse the JSON response
  const data = await response.json();

  // If the server returned an error, throw it so we can catch it in the component
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};

/**
 * GET request helper
 */
export const apiGet = (endpoint, getToken) =>
  apiFetch(endpoint, getToken, { method: 'GET' });

/**
 * POST request helper
 */
export const apiPost = (endpoint, getToken, body) =>
  apiFetch(endpoint, getToken, {
    method: 'POST',
    body: JSON.stringify(body),
  });


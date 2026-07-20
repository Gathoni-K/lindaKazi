/**
 * api.ts — Centralised fetch wrapper for the LindaKazi backend.
 *
 * All requests go through here so we have one place to:
 *  - Inject the base URL from the environment
 *  - Attach the Authorization header when a token is available
 *  - Throw structured errors that components can catch and display
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

interface ApiOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>;
  token?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  { body, token, ...init }: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error ?? `Request failed with status ${res.status}`,
      data?.details
    );
  }

  return data as T;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export interface SignUpPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  email: string | undefined;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export const authApi = {
  signUp: (payload: SignUpPayload) =>
    request<SignUpResponse>("/api/auth/signup", {
      method: "POST",
      body: payload as unknown as Record<string, unknown>,
    }),

  login: (payload: LoginPayload) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: payload as unknown as Record<string, unknown>,
    }),

  verify: (token: string) =>
    request<{ message: string; user: unknown }>("/api/auth/verify", {
      method: "GET",
      token,
    }),
};

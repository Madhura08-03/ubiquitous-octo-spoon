/**
 * Central HTTP client for the Samanvay FastAPI backend.
 *
 * Keep all browser -> backend transport concerns here. Feature services should
 * use this client rather than calling fetch directly or persisting domain data
 * in localStorage/sessionStorage.
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "")
const TOKEN_STORAGE_KEY = "jh_innovation_access_token"

export interface ApiError {
  status: number
  message: string
  details?: unknown
}

export interface ApiResult<T> {
  data: T
  status: number
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token: string): void {
  if (isBrowser()) sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken(): void {
  if (isBrowser()) sessionStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    try {
      return await response.json()
    } catch {
      return null
    }
  }
  return await response.text()
}

function errorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "detail" in body) {
    const detail = (body as { detail?: unknown }).detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "object" && item !== null && "msg" in item) {
            return String((item as { msg: unknown }).msg)
          }
          return String(item)
        })
        .join(", ")
    }
  }
  return fallback
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers)
  if (!headers.has("Accept")) headers.set("Accept", "application/json")

  const hasBody = init.body !== undefined && init.body !== null
  if (hasBody && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const token = getAccessToken()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...init,
      headers,
      credentials: "include",
      cache: "no-store",
    })
  } catch {
    throw {
      status: 0,
      message: `Unable to reach backend at ${API_URL}. Make sure the FastAPI server is running.`,
    } satisfies ApiError
  }

  const body = await parseResponseBody(response)
  if (!response.ok) {
    throw {
      status: response.status,
      message: errorMessage(body, `Backend request failed with status ${response.status}.`),
      details: body,
    } satisfies ApiError
  }

  return { data: body as T, status: response.status }
}

export const api = {
  get<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    return request<T>(path, { ...init, method: "GET" })
  },

  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResult<T>> {
    return request<T>(path, {
      ...init,
      method: "POST",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    })
  },

  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResult<T>> {
    return request<T>(path, {
      ...init,
      method: "PUT",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    })
  },

  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResult<T>> {
    return request<T>(path, {
      ...init,
      method: "PATCH",
      body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
    })
  },

  delete<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    return request<T>(path, { ...init, method: "DELETE" })
  },

  baseUrl: API_URL,
}

export async function checkBackendHealth(): Promise<ApiResult<{
  status: string
  service: string
  version: string
}>> {
  return api.get("/health")
}

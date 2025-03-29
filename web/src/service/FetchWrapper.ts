import Cookies from "js-cookie";

export class FetchWrapper {
  static async request<T>(
    method: string,
    url: string,
    body?: unknown,
    options?: RequestInit,
    retry: boolean = true
  ): Promise<T> {
    const token = Cookies.get("token");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (response.status === 401 && retry) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        return this.request(method, url, body, options, false);
      }
    }

    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }

    // Handle different response types based on Content-Type header
    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/plain")) {
      return response.text() as unknown as T; // Handle plain text responses
    }

    if (contentType?.includes("application/xml") || contentType?.includes("text/xml")) {
      return response.text() as unknown as T; // Handle XML responses (in case it's needed)
    }

    if (contentType?.includes("application/x-www-form-urlencoded")) {
      return response.text() as unknown as T; // Handle form responses (in case it's needed)
    }

    return response.text() as unknown as T; // Default to text for anything else (string, boolean, etc.)
  }

  static async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request("GET", url, undefined, options);
  }

  static async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request("POST", url, body, options);
  }

  static async put<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    return this.request("PUT", url, body, options);
  }

  static async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request("DELETE", url, undefined, options);
  }

  private static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/refresh", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        Cookies.set("token", data.token, { secure: true, sameSite: "Strict" });
        return true;
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
    }
    return false;
  }
}

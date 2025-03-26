/* eslint-disable @typescript-eslint/no-explicit-any */
export class FetchWrapper {
    static async get<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }

        const data: T = await response.json();
        return data;
    }

    static async post<T>(url: string, body: any, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...options?.headers,
            },
            body: JSON.stringify(body),
            ...options,
        });

        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }

        const data: T = await response.json();
        return data;
    }

    static async put<T>(url: string, body: any, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...options?.headers,
            },
            body: JSON.stringify(body),
            ...options,
        });

        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }

        const data: T = await response.json();
        return data;
    }

    static async delete<T>(url: string, options?: RequestInit): Promise<T> {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }

        const data: T = await response.json();
        return data;
    }
}

// src/services/shared/apiClient.ts
/**
 * Generic API client with interceptors and error handling
 * This is a conceptual implementation and would require a library like axios in a real project.
 * For this prototype, it will simulate fetch.
 */
import type { ApiResponse, ApiError } from '@/types/products';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
  }

  private getAuthToken(): string | null {
    // In a real app, get this from a secure store (e.g., HttpOnly cookie, auth context)
    if (typeof window !== 'undefined') {
        // Fallback for demo purposes
        return localStorage.getItem('mockAuthToken') || 'SANDBOX_KEY_123';
    }
    return 'SANDBOX_KEY_123'; // Server-side fallback
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async request<T>(method: string, url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...config,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          ...config?.headers,
        },
        body: data ? JSON.stringify(data) : null,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();
      
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: responseData,
          },
          message: responseData.error?.message || response.statusText,
        };
      }
      
      return responseData as ApiResponse<T>;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
  }

  async get<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request('GET', url, undefined, config);
  }

  async post<T>(url: string, data: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request('POST', url, data, config);
  }

  async patch<T>(url: string, data: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request('PATCH', url, data, config);
  }

  async delete<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request('DELETE', url, undefined, config);
  }
}

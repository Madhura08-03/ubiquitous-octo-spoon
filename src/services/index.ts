/**
 * Services Foundation for Societal Innovation Collaboration Portal.
 * Abstracts data access so mock data can be swapped with real backend APIs in future phases.
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Placeholder service client for future backend endpoints.
 */
export const apiClient = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    // In current phase, services resolve using local mock data.
    return {
      data: null,
      error: `Mock service endpoint '${endpoint}' ready for future backend integration.`,
      status: 200,
    };
  },
};
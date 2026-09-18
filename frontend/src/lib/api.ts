import { useAuthStore } from './store/authStore';
import { TeamMember } from '@/types';

function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    return ''; // Client browser uses relative requests to current domain/IP
  }
  return process.env.BACKEND_INTERNAL_URL || 'http://backend:4000';
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const apiBase = getApiBase();
  const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errorJson = await res.json();
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like 204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  // DPP
  getBatchPassport: (batchId: string) => apiRequest(`/api/v1/dpp/passport/${batchId}`),
  getAllBatches: () => apiRequest('/api/v1/dpp/batches'),
  createBatch: (batchData: any) =>
    apiRequest('/api/v1/dpp/batches', {
      method: 'POST',
      body: JSON.stringify(batchData),
    }),
  updateBatch: (batchNumber: string, batchData: any) =>
    apiRequest(`/api/v1/dpp/batches/${batchNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(batchData),
    }),
  addTimelineStep: (batchNumber: string, stepData: any) =>
    apiRequest(`/api/v1/dpp/batches/${batchNumber}/timeline`, {
      method: 'POST',
      body: JSON.stringify(stepData),
    }),
  deleteBatch: (batchNumber: string) =>
    apiRequest(`/api/v1/dpp/batches/${batchNumber}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: (employeeId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/v1/tasks${query}`);
  },
  getTaskStats: () => apiRequest('/api/v1/tasks/stats'),
  assignTask: (taskData: {
    title: string;
    description?: string;
    assignedTo: string;
    priority?: string;
    dueDate?: string;
    status?: string;
  }) =>
    apiRequest('/api/v1/tasks/assign', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),
  updateTaskStatus: (id: string, status: string) =>
    apiRequest(`/api/v1/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteTask: (id: string) =>
    apiRequest(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Users
  getEmployees: () => apiRequest('/api/v1/users/employees'),
  getAllUsers: () => apiRequest('/api/v1/users'),
  createStaff: (staffData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    department?: string;
    avatarUrl?: string;
  }) =>
    apiRequest('/api/v1/users/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/api/v1/users/${id}`, {
      method: 'DELETE',
    }),

  // Products & Orders
  getProducts: () => apiRequest('/api/v1/products'),
  getProduct: (id: string) => apiRequest(`/api/v1/products/${id}`),
  createProduct: (productData: any) =>
    apiRequest('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id: string, productData: any) =>
    apiRequest(`/api/v1/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id: string) =>
    apiRequest(`/api/v1/products/${id}`, {
      method: 'DELETE',
    }),
  checkout: (data: {
    customerEmail: string;
    customerName: string;
    shippingAddress: string;
    paymentMethod: string;
    items: { productId: string; quantity: number }[];
  }) =>
    apiRequest('/api/v1/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Investments
  getCrowdfarmProjects: () => apiRequest('/api/v1/investments/projects'),
  getCrowdfarmProject: (id: string) => apiRequest(`/api/v1/investments/projects/${id}`),
  createCrowdfarmProject: (projectData: any) =>
    apiRequest('/api/v1/investments/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
  updateCrowdfarmProject: (id: string, projectData: any) =>
    apiRequest(`/api/v1/investments/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    }),
  deleteCrowdfarmProject: (id: string) =>
    apiRequest(`/api/v1/investments/projects/${id}`, {
      method: 'DELETE',
    }),
  bookShares: (data: { projectId: string; sharesBooked: number; paymentMethod?: string }) =>
    apiRequest('/api/v1/investments/book', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMyInvestments: () => apiRequest('/api/v1/investments/my-investments'),
  getFinancialPlan: () => apiRequest('/api/v1/investments/financial-plan'),
  updateFinancialPlan: (data: any) =>
    apiRequest('/api/v1/investments/financial-plan', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Team
  getTeamMembers: (): Promise<TeamMember[]> => apiRequest('/api/v1/team'),
  getTeamMember: (id: string): Promise<TeamMember> => apiRequest(`/api/v1/team/${id}`),
  createTeamMember: (data: Partial<TeamMember>): Promise<TeamMember> =>
    apiRequest('/api/v1/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTeamMember: (id: string, data: Partial<TeamMember>): Promise<TeamMember> =>
    apiRequest(`/api/v1/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTeamMember: (id: string): Promise<any> =>
    apiRequest(`/api/v1/team/${id}`, {
      method: 'DELETE',
    }),
  reorderTeamMembers: (items: { id: string; order: number }[]): Promise<any> =>
    apiRequest('/api/v1/team/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
};

import { USE_MOCK_API } from "@/constants/app.const";
import { mockCustomer, mockUsers, mockAddresses } from "@/mocks/users.mock";
import type { User, CustomerProfile, Address } from "@/interfaces/user.types";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api.config";

export const userService = {
  getProfile: async (): Promise<CustomerProfile> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockCustomer;
    }
    const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      return { ...mockCustomer, ...data };
    }
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
    return response.data.data;
  },

  changePassword: async (_data: { currentPassword: string; newPassword: string }): Promise<void> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      return;
    }
    await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, _data);
  },

  getAddresses: async (): Promise<Address[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      return mockAddresses;
    }
    const response = await apiClient.get(API_ENDPOINTS.USERS.ADDRESSES);
    return response.data.data;
  },

  getUsers: async (): Promise<User[]> => {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 500));
      return mockUsers;
    }
    const response = await apiClient.get(API_ENDPOINTS.USERS.ALL);
    return response.data.data;
  },
};

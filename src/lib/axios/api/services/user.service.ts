import apiClient from '../client';

export const userService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  
  getUserById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
//   createUser: async (userData: any) => {
//     const response = await apiClient.post('/users', userData);
//     return response.data;
//   },
  
  // Add other user-related endpoints
};
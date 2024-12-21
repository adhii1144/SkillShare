import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  async searchUsers(query: string, filters: { bio?: string; location?: string }) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (filters.bio) params.append('bio', filters.bio);
      if (filters.location) params.append('location', filters.location);

      const response = await fetch(`${API_BASE_URL}/users/search?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  async fetchUserProfile(userId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user profile');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadProfileImage(userId: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      return await response.json();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
};

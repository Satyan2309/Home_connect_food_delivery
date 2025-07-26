import api from './api';

// Empty mock data for development
const mockMeals = [];

// Meal service functions
const mealService = {
  // Get all meals with optional filters
  getMeals: async (filters = {}) => {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        // Apply basic filtering
        let filteredMeals = [...mockMeals];
        
        if (filters.category) {
          filteredMeals = filteredMeals.filter(meal => meal.category === filters.category);
        }
        
        if (filters.dietary && filters.dietary.length) {
          filteredMeals = filteredMeals.filter(meal => 
            meal.dietaryTags.some(tag => filters.dietary.includes(tag)));
        }
        
        return filteredMeals;
      }
      
      // For production, use API
      const response = await api.get('/meals', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch meals';
    }
  },

  // Get a single meal by ID
  getMealById: async (id) => {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        const meal = mockMeals.find(meal => meal.id === id);
        if (!meal) {
          throw new Error('Meal not found');
        }
        return meal;
      }
      
      // For production, use API
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch meal details';
    }
  },

  // For chefs: Create a new meal
  createMeal: async (mealData) => {
    try {
      const response = await api.post('/meals', mealData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create meal';
    }
  },

  // For chefs: Update a meal
  updateMeal: async (id, mealData) => {
    try {
      const response = await api.put(`/meals/${id}`, mealData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update meal';
    }
  },

  // For chefs: Delete a meal
  deleteMeal: async (id) => {
    try {
      const response = await api.delete(`/meals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete meal';
    }
  },

  // For chefs: Toggle meal availability
  toggleAvailability: async (id, isAvailable) => {
    try {
      const response = await api.patch(`/meals/${id}/availability`, { isAvailable });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update meal availability';
    }
  },

  // Get meals by chef ID
  getMealsByChef: async (chefId) => {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        // Use the mock meals data and filter by chef ID
        const chefMeals = mockMeals.filter(meal => meal.chef.id === chefId);
        
        // If no meals found, return empty array
        if (chefMeals.length === 0) {
          return [];
        }
        
        return chefMeals;
      }
      
      // For production, use API
      const response = await api.get(`/meals/chef/${chefId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch chef\'s meals';
    }
  },
};

export default mealService;
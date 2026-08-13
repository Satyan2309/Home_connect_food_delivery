import api from './api';

// Mock data for development
const mockMeals = [
  {
    id: '1001',
    chef: { id: '1', name: "Sarah Johnson" },
    name: "Homemade Lasagna",
    description: "Traditional Italian lasagna with layers of pasta, rich meat sauce, creamy béchamel, and a blend of cheeses, baked to perfection.",
    price: 18.99,
    originalPrice: 22.99,
    prepTime: 45,
    serves: 2,
    quantity: 8,
    ingredients: ["Pasta sheets", "Ground beef", "Tomatoes", "Onions", "Garlic", "Mozzarella", "Parmesan", "Béchamel sauce", "Italian herbs", "Olive oil"],
    category: "main-course",
    dietaryTags: ["Dairy-Free"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 24,
    orders: 56,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    id: '1002',
    chef: { id: '1', name: "Sarah Johnson" },
    name: "Mediterranean Quinoa Bowl",
    description: "Nutritious bowl with fluffy quinoa, roasted vegetables, chickpeas, olives, and feta cheese, drizzled with lemon-herb dressing.",
    price: 14.50,
    originalPrice: null,
    prepTime: 25,
    serves: 1,
    quantity: 12,
    ingredients: ["Quinoa", "Bell peppers", "Zucchini", "Chickpeas", "Kalamata olives", "Feta cheese", "Cherry tomatoes", "Cucumber", "Lemon juice", "Olive oil", "Fresh herbs"],
    category: "lunch",
    dietaryTags: ["Vegetarian", "Gluten-Free", "Low-Carb"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 18,
    orders: 42,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: '1003',
    chef: { id: '1', name: "Sarah Johnson" },
    name: "Tiramisu Cups",
    description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder and served in individual cups.",
    price: 8.99,
    originalPrice: null,
    prepTime: 20,
    serves: 1,
    quantity: 15,
    ingredients: ["Ladyfingers", "Mascarpone cheese", "Eggs", "Sugar", "Coffee", "Cocoa powder", "Vanilla extract"],
    category: "desserts",
    dietaryTags: ["Vegetarian"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 32,
    orders: 78,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: '1004',
    chef: { id: '1', name: "Sarah Johnson" },
    name: "Spicy Thai Basil Chicken",
    description: "Stir-fried minced chicken with Thai basil, chili, garlic, and soy sauce, served with jasmine rice and a fried egg on top.",
    price: 16.99,
    originalPrice: null,
    prepTime: 30,
    serves: 1,
    quantity: 10,
    ingredients: ["Chicken", "Thai basil", "Chili", "Garlic", "Soy sauce", "Oyster sauce", "Fish sauce", "Sugar", "Jasmine rice", "Egg"],
    category: "dinner",
    dietaryTags: ["Spicy"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 21,
    orders: 49,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '1005',
    chef: { id: '1', name: "Sarah Johnson" },
    name: "Avocado Toast with Poached Egg",
    description: "Artisanal sourdough bread topped with smashed avocado, poached egg, microgreens, and a sprinkle of red pepper flakes.",
    price: 12.50,
    originalPrice: 14.50,
    prepTime: 15,
    serves: 1,
    quantity: 20,
    ingredients: ["Sourdough bread", "Avocado", "Eggs", "Microgreens", "Red pepper flakes", "Lemon juice", "Salt", "Pepper", "Olive oil"],
    category: "breakfast",
    dietaryTags: ["Vegetarian", "Organic"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop",
    rating: 4.5,
    reviews: 15,
    orders: 38,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '1006',
    chef: { id: '2', name: "Carlos Rodriguez" },
    name: "Mango Coconut Chia Pudding",
    description: "Creamy coconut milk chia pudding topped with fresh mango, toasted coconut flakes, and a drizzle of honey.",
    price: 7.99,
    originalPrice: null,
    prepTime: 10,
    serves: 1,
    quantity: 18,
    ingredients: ["Chia seeds", "Coconut milk", "Mango", "Honey", "Coconut flakes", "Vanilla extract"],
    category: "breakfast",
    dietaryTags: ["Vegan", "Gluten-Free", "Dairy-Free"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&h=400&fit=crop",
    rating: 4.4,
    reviews: 12,
    orders: 29,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '1007',
    chef: { id: '2', name: "Carlos Rodriguez" },
    name: "Caprese Stuffed Portobello Mushrooms",
    description: "Portobello mushroom caps filled with fresh mozzarella, cherry tomatoes, and basil, drizzled with balsamic glaze.",
    price: 13.99,
    originalPrice: 15.99,
    prepTime: 25,
    serves: 2,
    quantity: 14,
    ingredients: ["Portobello mushrooms", "Mozzarella cheese", "Cherry tomatoes", "Fresh basil", "Balsamic glaze", "Olive oil", "Garlic", "Salt", "Pepper"],
    category: "appetizers",
    dietaryTags: ["Vegetarian", "Gluten-Free", "Low-Carb", "Keto"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 19,
    orders: 44,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: '1008',
    chef: { id: '2', name: "Carlos Rodriguez" },
    name: "Butter Chicken with Naan",
    description: "Tender chicken pieces in a rich, creamy tomato-based curry sauce, served with freshly baked naan bread.",
    price: 19.99,
    originalPrice: null,
    prepTime: 40,
    serves: 2,
    quantity: 8,
    ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Onions", "Garlic", "Ginger", "Garam masala", "Fenugreek", "Naan bread"],
    category: "main-course",
    dietaryTags: ["Spicy", "Halal"],
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 28,
    orders: 67,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
];

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
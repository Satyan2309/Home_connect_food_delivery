const asyncHandler = require('express-async-handler');
const Meal = require('../models/mealModel');
const User = require('../models/userModel');

// @desc    Fetch all meals based on filters
// @route   GET /api/meals
// @access  Public
const getMeals = asyncHandler(async (req, res) => {
    const { searchQuery, cuisine, dietary, price, delivery } = req.query;
    
    let query = {};

    if (searchQuery) {
        const keyword = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { category: { $regex: searchQuery, $options: 'i' } },
            ],
        };
        query = { ...query, ...keyword };
    }

    if (cuisine) {
        query.category = { $in: cuisine.split(',') };
    }

    if (dietary) {
        query.dietaryTags = { $in: dietary.split(',') };
    }

    // Note: Price and delivery time filters would be more complex in a real app
    // This is a simplified version.
    
    const meals = await Meal.find(query).populate('chef', 'fullName rating profileImage');
    res.json(meals);
});

// @desc    Fetch a single meal by ID
// @route   GET /api/meals/:id
// @access  Public
const getMealById = asyncHandler(async (req, res) => {
    const meal = await Meal.findById(req.params.id).populate('chef', 'fullName rating profileImage specialties');
    if (meal) {
        res.json(meal);
    } else {
        res.status(404);
        throw new Error('Meal not found');
    }
});

// @desc    Get meals for the logged-in chef
// @route   GET /api/meals/my-meals
// @access  Private/Chef
const getMyMeals = asyncHandler(async (req, res) => {
    const meals = await Meal.find({ chef: req.user.id });
    res.json(meals);
});

// @desc    Create a new meal
// @route   POST /api/meals
// @access  Private/Chef
const createMeal = asyncHandler(async (req, res) => {
    const {
        name, description, price, originalPrice, image, category,
        prepTime, serves, quantity, ingredients, dietaryTags, isAvailable
    } = req.body;

    const meal = new Meal({
        chef: req.user.id,
        name,
        description,
        price,
        originalPrice,
        image,
        category,
        prepTime,
        serves,
        quantity,
        ingredients,
        dietaryTags,
        isAvailable,
    });

    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
});

// @desc    Update a meal
// @route   PUT /api/meals/:id
// @access  Private/Chef
const updateMeal = asyncHandler(async (req, res) => {
    const {
        name, description, price, originalPrice, image, category,
        prepTime, serves, quantity, ingredients, dietaryTags, isAvailable
    } = req.body;

    const meal = await Meal.findById(req.params.id);

    if (meal) {
        // Check if the logged-in user is the chef who created the meal
        if (meal.chef.toString() !== req.user.id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this meal');
        }

        meal.name = name || meal.name;
        meal.description = description || meal.description;
        meal.price = price || meal.price;
        meal.originalPrice = originalPrice; // Can be null
        meal.image = image || meal.image;
        meal.category = category || meal.category;
        meal.prepTime = prepTime || meal.prepTime;
        meal.serves = serves || meal.serves;
        meal.quantity = quantity ?? meal.quantity;
        meal.ingredients = ingredients || meal.ingredients;
        meal.dietaryTags = dietaryTags || meal.dietaryTags;
        meal.isAvailable = isAvailable ?? meal.isAvailable;

        const updatedMeal = await meal.save();
        res.json(updatedMeal);

    } else {
        res.status(404);
        throw new Error('Meal not found');
    }
});

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private/Chef
const deleteMeal = asyncHandler(async (req, res) => {
    const meal = await Meal.findById(req.params.id);

    if (meal) {
        if (meal.chef.toString() !== req.user.id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this meal');
        }

        await meal.deleteOne(); // Use deleteOne() instead of remove()
        res.json({ message: 'Meal removed' });
    } else {
        res.status(404);
        throw new Error('Meal not found');
    }
});

module.exports = {
    getMeals,
    getMealById,
    getMyMeals,
    createMeal,
    updateMeal,
    deleteMeal,
};

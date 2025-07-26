const express = require('express');
const router = express.Router();
const {
    getMeals,
    getMealById,
    getMyMeals,
    createMeal,
    updateMeal,
    deleteMeal,
} = require('../controllers/mealController');
const { protect, chef } = require('../middleware/authMiddleware');

router.route('/')
    .get(getMeals)
    .post(protect, chef, createMeal);

router.route('/my-meals').get(protect, chef, getMyMeals);

router.route('/:id')
    .get(getMealById)
    .put(protect, chef, updateMeal)
    .delete(protect, chef, deleteMeal);

module.exports = router;

const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {
  getPlans,
  fetchPlanById,
  makePlan,
  updatePlan,
  removePlan,
  addMealToPlan,
  deleteMealFromPlan
} = require('../controllers/planController')

// protect all routes - user must be logged in
router.use(protect)

// plan CRUD routes
router.route('/').get(getPlans).post(makePlan)
router.route('/:id').get(fetchPlanById).put(updatePlan).delete(removePlan)

// meal routes (nested under plan)
router.post('/:id/meals',addMealToPlan)
router.delete('/:id/meals/:mealId', deleteMealFromPlan)
// router.put('/:id/meals/:mealId', updateMeal) // maybe add this later

module.exports = router

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

//all routes need authentication
router.use(protect)

router.route('/').get(getPlans).post(makePlan)
router.route('/:id').get(fetchPlanById).put(updatePlan).delete(removePlan)
router.post('/:id/meals',addMealToPlan)
router.delete('/:id/meals/:mealId', deleteMealFromPlan)

module.exports = router

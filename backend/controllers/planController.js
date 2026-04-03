const NutritionPlan = require('../models/NutritionPlan')

// get all plans for the user thats logged in
const getPlans = async (req,res) => {
    try{
        const plans = await NutritionPlan.find({ user: req.user._id }).sort({createdAt:-1})
        res.json(plans)
    }catch(err){
        res.status(500).json({message:'Server error while fetching plans'})
    }
}

//get single plan
const fetchPlanById = async(req, res) =>{
    try {
        const plan = await NutritionPlan.findById(req.params.id)
        if(!plan){
            return res.status(404).json({message:'Plan not found'})
        }
        //check if user owns this
        if(plan.user.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: 'Not authorized to view this plan'})
        }
        res.json(plan)
    } catch(err) {
        res.status(500).json({ message:'Error retreiving plan'})
    }
}

// create new plan
const makePlan = async(req,res)=>{
    try{
      const {planName, description,goal,targetCalories,startDate,endDate} = req.body
      const newPlan = new NutritionPlan({
        user: req.user._id,
        planName,
        description,
        goal,
        targetCalories,
        startDate,
        endDate
      })
      const savedPlan = await newPlan.save()
      res.status(201).json(savedPlan)
    }catch(err){
      res.status(500).json({message:'Could not create plan'})
    }
}


//update plan
const updatePlan = async (req,res) => {
  try{
    const plan = await NutritionPlan.findById(req.params.id)
    if (!plan) {
      return res.status(404).json({message:'Plan not found'})
    }
    if(plan.user.toString()!== req.user._id.toString()){
      return res.status(401).json({message: 'Not authrized'})
    }

    const updatedPlan = await NutritionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    )
    res.json(updatedPlan)
  }catch(err){
    res.status(500).json({message: 'Failed to update plan'})
  }
}

// delet a plan
const removePlan = async(req, res)=>{
  try {
      const plan = await NutritionPlan.findById(req.params.id)
      if(!plan){
          return res.status(404).json({message:'Plan not found'})
      }
      if(plan.user.toString() !== req.user._id.toString()){
          return res.status(401).json({message:'Not authorized to delete'})
      }
      await NutritionPlan.findByIdAndDelete(req.params.id)
      res.json({message:'Plan removed successfully'})
  }catch(err){
      res.status(500).json({message:'Error deleting plan'})
  }
}

//add meal to a plan
const addMealToPlan = async (req,res) =>{
  try{
    const plan = await NutritionPlan.findById(req.params.id)
    if (!plan){
        return res.status(404).json({message:'Plan not found'})
    }
    if (plan.user.toString()!==req.user._id.toString()) {
        return res.status(401).json({message:'Unauthorized'})
    }
    plan.meals.push(req.body)
    const updatedPlan = await plan.save()
    res.status(201).json(updatedPlan)
  } catch(err){
    res.status(500).json({message:'Couldnt add meal'})
  }
}

// remove meal from plan
const deleteMealFromPlan = async(req, res)=>{
    try{
      const plan = await NutritionPlan.findById(req.params.id)
      if(!plan) {
        return res.status(404).json({message:'Plan not found'})
      }
      if(plan.user.toString()!== req.user._id.toString()){
        return res.status(401).json({message: 'Not authorized'})
      }
      plan.meals = plan.meals.filter(
        (meal) => meal._id.toString() !== req.params.mealId
      )
      const updatedPlan = await plan.save()
      res.json(updatedPlan)
    }catch(err){
      res.status(500).json({message:'Error removing meal from plan'})
    }
}

module.exports = { getPlans,fetchPlanById, makePlan,updatePlan,removePlan,addMealToPlan, deleteMealFromPlan }

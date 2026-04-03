const NutritionPlan = require('../models/NutritionPlan')
const mongoose = require('mongoose') // might need this later for objectid validation


// get all plans for the user thats logged in
const getPlans = async (req, res) => {
    try {
        const plans = await NutritionPlan.find({user: req.user._id}).sort({ createdAt: -1 })
        // console.log('plans fetched:', plans.length)
        res.json(plans)
    } catch(err) {
        console.log(err.message)
        res.status(500).json({ message:'Server error while fetching plans' })
    }
}

//get single plan by id
const fetchPlanById = async(req,res) =>{
    try{
        const plan = await NutritionPlan.findById(req.params.id)
        if(!plan) {
            return res.status(404).json({message: 'Plan not found'})
        }
        //check if user owns this plan
        if( plan.user.toString() !== req.user._id.toString() ){
            return res.status(401).json({message: 'Not authorized to view this plan'})
        }
        res.json(plan)
    }catch(err){
        res.status(500).json({message:'Error retreiving plan'})
    }
}


// create new plan
const makePlan = async(req,res)=>{
    try{
      const { planName, description, goal, targetCalories, startDate, endDate } = req.body

      // TODO: add proper validation here maybe check if planName already exists?
      if(!planName) {
        return res.status(400).json({message:'Plan name is required'})
      }

      const newPlan = new NutritionPlan({
        user: req.user._id,
        planName,
        description,
        goal,
        targetCalories,
        startDate,  endDate
      })
      const savedPlan = await newPlan.save()
      console.log('new plan created:', savedPlan._id)
      res.status(201).json(savedPlan)
    } catch(err) {
      console.log('create plan error:', err.message)
      res.status(500).json({ message:'Could not create plan' })
    }
}


//update existing plan
const updatePlan = async(req, res) =>{
  try {
    let plan = await NutritionPlan.findById(req.params.id)
    if(!plan){
      return res.status(404).json({message:'Plan not found'})
    }
    if (plan.user.toString()!== req.user._id.toString()){
      return res.status(401).json({message:'Not authrized'})
    }

    // i was originally doing it like plan.planName = req.body.planName etc
    // but findByIdAndUpdate is cleaner
    const updatedPlan = await NutritionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators:true }
    )
    res.json(updatedPlan)
  } catch(err){
    console.log(err)
    res.status(500).json({message:'something went wrong'})
  }
}

// delet a plan
const removePlan = async(req,res) =>{
  try{
      const plan = await NutritionPlan.findById(req.params.id)
      if (!plan){
          return res.status(404).json({ message:'Plan not found'})
      }
      if(plan.user.toString() !==req.user._id.toString()){
          return res.status(401).json({message:'Not authorized to delete'})
      }
      await NutritionPlan.findByIdAndDelete(req.params.id)
      res.json({ message: 'Plan removed successfully'})
  } catch(err){
      res.status(500).json({message: 'Error deleting plan'})
  }
}

//add a meal to a plan
const addMealToPlan = async(req, res) =>{
  try {
    const plan = await NutritionPlan.findById(req.params.id)
    if(!plan){
        return res.status(404).json({message:'Plan not found'})
    }
    if(plan.user.toString() !==req.user._id.toString()){
        return res.status(401).json({message: 'Unauthorized'})
    }
    // const meal = {mealName: req.body.mealName, mealType: req.body.mealType, calories: req.body.calories}
    plan.meals.push(req.body)
    const updatedPlan = await plan.save()
    res.status(201).json(updatedPlan)
  }catch(err){
    console.log('add meal error', err)
    res.status(500).json({message:'Couldnt add meal'})
  }
}


// remove a meal from plan
const deleteMealFromPlan = async(req,res) =>{
    try{
      const plan = await NutritionPlan.findById( req.params.id )
      if(!plan){
        return res.status(404).json({ message:'Plan not found' })
      }
      if(plan.user.toString() !== req.user._id.toString()){
        return res.status(401).json({ message:'Not authorized'})
      }
      plan.meals = plan.meals.filter(
        (meal) => meal._id.toString() !==req.params.mealId
      )
      const updatedPlan = await plan.save()
      res.json(updatedPlan)
    }catch(err){
      res.status(500).json({ message:'Error removing meal from plan'})
    }
}

module.exports = {
    getPlans,
    fetchPlanById,
    makePlan,
    updatePlan,
    removePlan,
    addMealToPlan,
    deleteMealFromPlan
}

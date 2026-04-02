const mongoose = require('mongoose')

//meal schema - embedded inside plan
const mealSchema = new mongoose.Schema({
  mealName:{
    type: String,
    required: true
  },
  mealType:{
    type:String,
    enum:['breakfast','lunch','dinner','snack'],
    default:'lunch'
  },
  calories:{
    type:Number,
    default:0
  },
  protien:{
    type:Number,
    default:0
  },
  carbs:{
    type: Number,
    default: 0
  },
  fats:{
    type:Number,
    default:0
  },
  notes: String
},{ timestamps:true })


const nutritionPlanSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  planName:{
    type:String,
    required:[true, 'Plan name is required']
  },
  description:{
    type: String,
    default:''
  },
  goal:{
    type:String,
    enum:['weight_loss','muscle_gain','maintenance','calorie_tracking'],
    default:'maintenance'
  },
  targetCalories:{
    type:Number,
    default: 2000
  },
  startDate:{
    type:Date,
    default: Date.now
  },
  endDate: {
    type: Date,
  },
  status: {
    type:String,
    enum:['active','paused','completed'],
    default:'active'
  },
  meals: [mealSchema]
},{ timestamps: true })

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema)

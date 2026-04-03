import { useState,useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../axiosConfig'

const PlanMeals = () => {
  const {id} = useParams()
  const {user} = useAuth()
  const [plan,setPlan] = useState(null)
  const [loading,setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [mealData,setMealData] = useState({
    mealName:'',
    mealType:'lunch',
    calories:'',
    protien:'',
    carbs:'',
    fats:'',
    notes:''
  })

  const fetchPlan = async()=>{
    try {
      const res = await axiosInstance.get(`/api/plans/${id}`,{
        headers: {Authorization:`Bearer ${user.token}`}
      })
      setPlan(res.data)
    } catch(err) {
      alert('Error loading plan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(user) fetchPlan()
  },[id,user])

  const handleMealChange =(e)=>{
    setMealData({...mealData, [e.target.name]:e.target.value})
  }

  const addMeal = async(e)=>{
    e.preventDefault()
    try{
      console.log('adding meal:', mealData)
      const res = await axiosInstance.post(`/api/plans/${id}/meals`,mealData,{
        headers:{Authorization:`Bearer ${user.token}`}
      })
      setPlan(res.data)
      //reset the form
      setMealData({mealName:'',mealType:'lunch',calories:'',protien:'',carbs:'',fats:'',notes:''})
      setShowForm(false)
    }catch(err){
      console.log(err)
      alert('Failed to add meal')
    }
  }

  const removeMeal = async(mealId)=>{
    if(!window.confirm('Remove this meal?')) return
    try{
      const res = await axiosInstance.delete(`/api/plans/${id}/meals/${mealId}`,{
        headers:{Authorization:`Bearer ${user.token}`}
      })
      setPlan(res.data)
    }catch(err){
      alert('Could not remove meal')
    }
  }

  if(loading) return <div className="text-center mt-10">Loading meals...</div>
  if(!plan) return <div className="text-center mt-10">Plan not found</div>

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Meals - {plan.planName}</h1>
        <button onClick={()=>setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {showForm ? 'Cancel':'+ Add Meal'}
        </button>
      </div>

      {showForm &&(
        <form onSubmit={addMeal} className="bg-white p-4 shadow rounded mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Meal Name</label>
              <input type="text" name="mealName" value={mealData.mealName}
                onChange={handleMealChange} required className="w-full p-2 border rounded"
                placeholder="e.g. Grilled Chicken"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select name="mealType" value={mealData.mealType}
                onChange={handleMealChange} className="w-full p-2 border rounded">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Calories</label>
              <input type="number" name="calories" value={mealData.calories}
                onChange={handleMealChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Protein</label>
              <input type="number" name="protien" value={mealData.protien}
                onChange={handleMealChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Carbs</label>
              <input type="number" name="carbs" value={mealData.carbs}
                onChange={handleMealChange} className="w-full p-2 border rounded"/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fats</label>
              <input type="number" name="fats" value={mealData.fats}
                onChange={handleMealChange} className="w-full p-2 border rounded"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input type="text" name="notes" value={mealData.notes}
              onChange={handleMealChange} className="w-full p-2 border rounded" placeholder="Optional notes"/>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Meal</button>
        </form>
      )}

      {plan.meals && plan.meals.length > 0 ?(
        <div className="space-y-3">
          {plan.meals.map((meal) =>(
            <div key={meal._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{meal.mealName}</h3>
                <p className="text-sm text-gray-500">{meal.mealType} | {meal.calories} cal | P:{meal.protien}g C:{meal.carbs}g F:{meal.fats}g</p>
                {meal.notes &&<p className="text-xs text-gray-400 mt-1">{meal.notes}</p>}
              </div>
              <button onClick={()=> removeMeal(meal._id)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
            </div>
          ))}
        </div>
      ):(
        <p className="text-gray-500 text-center">No meals added yet. Click "+ Add Meal" to get started.</p>
      )}

      <div className="mt-6">
        <Link to={`/plans/${id}`} className="text-green-600 hover:underline">Back to Plan Details</Link>
      </div>
    </div>
  )
}

export default PlanMeals

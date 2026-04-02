import {useState, useEffect} from 'react'
import {useParams,Link} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import axiosInstance from '../axiosConfig'

const PlanDetail = ()=>{
  const {id} = useParams()
  const {user} = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading ,setLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const res = await axiosInstance.get(`/api/plans/${id}`,{
          headers:{Authorization:`Bearer ${user.token}`}
        })
        setPlan(res.data)
      }catch(err){
        alert('Failed to load plan details')
      }finally{
        setLoading(false)
      }
    }
    if(user) fetchData()
  },[id,user])

  if(loading) return <div className="text-center mt-10">Loading plan details...</div>
  if(!plan) return <div className="text-center mt-10">Plan not found</div>

  //calc total cals from meals
  const totalMealCals = plan.meals?.reduce((sum,m) => sum + (m.calories || 0), 0) || 0

  return(
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-green-700">{plan.planName}</h1>
          <span className={`text-sm px-3 py-1 rounded ${plan.status==='active'?'bg-green-100 text-green-700':plan.status==='paused'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600'}`}>
            {plan.status}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{plan.description || 'No description'}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Goal</p>
            <p className="font-semibold">{plan.goal?.replace('_',' ')}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Target Calories</p>
            <p className="font-semibold">{plan.targetCalories}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Meals Logged</p>
            <p className="font-semibold">{plan.meals?.length || 0}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">Total Meal Cals</p>
            <p className="font-semibold">{totalMealCals}</p>
          </div>
        </div>

        {plan.meals && plan.meals.length > 0 &&(
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Meals Summary</h2>
            <div className="space-y-2">
              {plan.meals.map((meal,idx) =>(
                <div key={meal._id || idx} className="flex justify-between bg-gray-50 p-2 rounded">
                  <span>{meal.mealName} ({meal.mealType})</span>
                  <span className="text-gray-600">{meal.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Link to={`/edit-plan/${plan._id}`} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Edit Plan</Link>
          <Link to={`/plans/${plan._id}/meals`} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Manage Meals</Link>
          <Link to="/plans" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Back to Plans</Link>
        </div>
      </div>
    </div>
  )
}

export default PlanDetail

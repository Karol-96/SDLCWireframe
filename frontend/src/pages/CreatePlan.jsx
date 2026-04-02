import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'
import axiosInstance from '../axiosConfig'

const CreatePlan = ()=>{
  const {user} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    planName:'',
    description:'',
    goal:'maintenance',
    targetCalories: 2000,
    startDate:'',
    endDate:''
  })

  const handleChange =(e)=>{
    setFormData({...formData,[e.target.name]: e.target.value})
  }

  // submit the form
  const submitForm = async(e)=>{
    e.preventDefault()
    try{
      await axiosInstance.post('/api/plans',formData,{
        headers:{Authorization:`Bearer ${user.token}`}
      })
      navigate('/plans')
    }catch(err){
      alert('Failed to create plan. Check your inputs.')
    }
  }

  return(
    <div className="max-w-lg mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Create Nutrition Plan</h1>
      <form onSubmit={submitForm} className="bg-white p-6 shadow-md rounded space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Plan Name</label>
          <input type="text" name="planName" value={formData.planName}
            onChange={handleChange} required
            className="w-full p-2 border rounded"
            placeholder="e.g. Summer Diet"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={formData.description}
            onChange={handleChange} rows="3"
            className="w-full p-2 border rounded"
            placeholder="Brief description of your plan"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="calorie_tracking">Calorie Tracking</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Calories</label>
          <input type="number" name="targetCalories" value={formData.targetCalories}
            onChange={handleChange} className="w-full p-2 border rounded"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate}
              onChange={handleChange} className="w-full p-2 border rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" name="endDate" value={formData.endDate}
              onChange={handleChange} className="w-full p-2 border rounded"/>
          </div>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Create Plan
        </button>
      </form>
    </div>
  )
}

export default CreatePlan

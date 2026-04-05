import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
// import { format } from 'date-fns'; // removed - just using split('T') instead

const EditPlan = () => {
  const { id } = useParams();
  const {user} = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName:'',
    description:'',
    goal:'maintenance',
    targetCalories: 2000,
    startDate:'',
    endDate: '',
    status:'active'
  });
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const getPlan = async() =>{
      try{
        const res = await axiosInstance.get(`/api/plans/${id}`, {
          headers:{Authorization: `Bearer ${user.token}`}
        });
        const p = res.data;
        setFormData({
          planName: p.planName || '',
          description: p.description || '',
          goal: p.goal || 'maintenance',
          targetCalories: p.targetCalories || 2000,
          startDate: p.startDate ? p.startDate.split('T')[0] :'',
          endDate: p.endDate ? p.endDate.split('T')[0] : '',
          status: p.status || 'active'
        });
      }catch(err){
        alert('Could not load plan data');
        navigate('/plans');
      } finally{
        setLoading(false);
      }
    };
    if (user) getPlan();
  },[id,user, navigate]);

  const handleChange =(e)=> {
    setFormData({ ...formData,[e.target.name]: e.target.value});
  };

  const handleUpdate = async(e) =>{
    e.preventDefault();
    try{
      await axiosInstance.put(`/api/plans/${id}`,formData, {
        headers: {Authorization: `Bearer ${user.token}`}
      });
      // TODO: maybe show a success toast instead of just navigating away
      navigate('/plans');
    } catch(err){
      console.log('update error', err);
      alert('Update failed');
    }
  };

  if(loading) return <div className="text-center mt-10">Loading...</div>;

  return(
    <div className="max-w-lg mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Edit Plan</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 shadow-md rounded space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Plan Name</label>
          <input type="text" name="planName" value={formData.planName}
            onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" value={ formData.description}
            onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange}
            className="w-full p-2 border rounded">
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
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange}
            className="w-full p-2 border rounded">
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate}
              onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input type="date" name="endDate" value={formData.endDate }
              onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>
        <button type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPlan;

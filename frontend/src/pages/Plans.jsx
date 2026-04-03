import { useState, useEffect,useCallback } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Plans = () =>{
  const { user } = useAuth();
  const [plans,setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);  // might use this later

  useEffect(() =>{
    const loadPlans = async() => {
      try{
        const res = await axiosInstance.get('/api/plans', {
          headers: {Authorization: `Bearer ${user.token}` }
        });
        console.log('loaded plans:', res.data.length);
        setPlans(res.data);
      } catch(err){
        console.log('Failed to load plans', err);
        // setError(err.message);
      } finally{
        setLoading(false);
      }
    };
    if(user) loadPlans();
  }, [user]);

  const handleDelete = async(id) => {
    if(!window.confirm('Are you sure you want to delete this plan?')) return;
    try{
      await axiosInstance.delete(`/api/plans/${id}`, {
        headers: { Authorization:`Bearer ${user.token}` }
      });
      setPlans(plans.filter(p => p._id !== id));
    }catch(err) {
      alert('Failed to delete plan');
    }
  };

  // filtering logic - TODO: maybe add sort by date too?
  const filterdPlans = plans.filter(plan =>{
    const matchsSearch = plan.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGoal = filterGoal === 'all' || plan.goal === filterGoal;
    return matchsSearch && matchGoal;
  });

  if(loading) return <div className="text-center mt-10">Loading plans...</div>

  return(
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">My Nutrition Plans</h1>
        <Link to="/create-plan" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Plan
        </Link>
      </div>

      {/* search and filter bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select value={filterGoal} onChange={(e)=> setFilterGoal(e.target.value)}
          className="p-2 border rounded">
          <option value="all">All Goals</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
          <option value="calorie_tracking">Calorie Tracking</option>
        </select>
      </div>

      {filterdPlans.length === 0 ?(
        <p className="text-gray-500 text-center">No plans found. Create your first nutrition plan!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterdPlans.map(plan =>(
            <div key={plan._id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <h2 className="text-lg font-semibold mb-1">{plan.planName}</h2>
              <p className="text-sm text-gray-500 mb-2">{plan.goal?.replace('_',' ')}</p>
              <p className="text-sm text-gray-600 mb-3">
                Target: {plan.targetCalories} cal | Meals: {plan.meals?.length || 0}
              </p>
              <span className={`text-xs px-2 py-1 rounded ${ plan.status === 'active' ? 'bg-green-100 text-green-700' : plan.status==='paused' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                {plan.status}
              </span>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Link to={`/plans/${plan._id}`} className="text-sm text-blue-600 hover:underline">View</Link>
                <Link to={`/edit-plan/${plan._id}`} className="text-sm text-green-600 hover:underline">Edit</Link>
                <Link to={`/plans/${plan._id}/meals`} className="text-sm text-purple-600 hover:underline">Meals</Link>
                <button onClick={()=> handleDelete(plan._id)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;

import {useAuth} from '../context/AuthContext'
import {Link} from 'react-router-dom'

// dashboard / home page
const Dashboard = () =>{
  const {user} = useAuth()

  return(
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Welcome to NutriPlan Manager
        </h1>
        {user ?(
          <div>
            <p className="text-gray-600 mb-6">
              Hello, <span className="font-semibold">{user.name || 'User'}</span>!
              Manage your nutrition plans and track your meals easily.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/plans" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition">
                View My Plans
              </Link>
              <Link to="/create-plan" className="bg-green-100 text-green-800 p-4 rounded-lg text-center hover:bg-green-200 transition">
                Create New Plan
              </Link>
            </div>
          </div>
        ):(
          <div>
            <p className="text-gray-600 mb-6">
              Track your nutrition goals, manage meal plans, and stay on top of your diet.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Login</Link>
              <Link to="/register" className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">Register</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

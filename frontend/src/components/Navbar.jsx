import {Link} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const Navbar = ()=>{
  const {user, logout} = useAuth()

  return(
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">NutriPlan Manager</Link>
        <div className="flex gap-4 items-center">
          {user?(
            <>
              <Link to="/plans" className="hover:text-green-200">Plans</Link>
              <Link to="/create-plan" className="hover:text-green-200">New Plan</Link>
              <Link to="/profile" className="hover:text-green-200">Profile</Link>
              <button onClick={logout} className="bg-green-800 px-3 py-1 rounded hover:bg-green-900">Logout</button>
            </>
          ):(
            <>
              <Link to="/login" className="hover:text-green-200">Login</Link>
              <Link to="/register" className="hover:text-green-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

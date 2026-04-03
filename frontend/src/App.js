import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';
import PlanDetail from './pages/PlanDetail';
import PlanMeals from './pages/PlanMeals';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/plans" element={<Plans/>}/>
          <Route path="/create-plan" element={<CreatePlan/>}/>
          <Route path="/edit-plan/:id" element={<EditPlan/>}/>
          <Route path="/plans/:id" element={<PlanDetail/>}/>
          <Route path="/plans/:id/meals" element={<PlanMeals/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

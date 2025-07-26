import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import CreatePlan from "./pages/CreatePlan.jsx";
import About from "./pages/About.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import Resources from "./pages/Resources.jsx";
import MealPlans from "./pages/MealPlansPage.jsx";
import ExplorePastTrips from "./pages/ExplorePastTrips.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import LoginSignup from "./pages/LoginSignup.jsx";
import ViewProfile from "./pages/ViewProfile.jsx";
import Error from "./pages/Error.jsx";
import Admin from "./pages/Admin.jsx";
import "./App.css";

function RouteWatcher() {
  const location = useLocation();

  useEffect(() => {
    const isOnPlan = location.pathname.includes("plan");
    if (!isOnPlan) {
      localStorage.removeItem("formData");
      localStorage.removeItem("page");
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
}

function App() {
  const user = useAuth();

  return (
    <Router>
      <RouteWatcher />
      <div className="background-image" />
      <div className="main-content">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/plan"
            element={
              <ProtectedRoute redirectTo="/account-management/login">
                <CreatePlan />
              </ProtectedRoute>
            }
          />
          <Route path="/resources" element={<Resources />}></Route>
          <Route path="/mealplans" element={<MealPlans />}></Route>
          <Route path="/explore" element={<ExplorePastTrips />}></Route>
          <Route path="/trip" element={<TripDetails />}></Route>
          <Route
            path="/account-management/:inputMode"
            element={<LoginSignup />}
          ></Route>
          <Route path="/error" element={<Error />}></Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute redirectTo="/login">
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error errorCode={404} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

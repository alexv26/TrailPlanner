import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./App.css";

function App() {
  return (
    <Router>
      <div className="background-image" />
      <NavigationBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/plan"
            element={
              <ProtectedRoute redirectTo="/login">
                <CreatePlan />
              </ProtectedRoute>
            }
          />
          <Route path="/resources" element={<Resources />}></Route>
          <Route path="/mealplans" element={<MealPlans />}></Route>
          <Route path="/explore" element={<ExplorePastTrips />}></Route>
          <Route path="/trip/:tripIndex" element={<TripDetails />}></Route>
          <Route path="/login" element={<LoginSignup />}></Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute redirectTo="/login">
                <ViewProfile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error errorNum={404} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

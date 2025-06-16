import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import CreatePlan from "./pages/CreatePlan.jsx";
import About from "./pages/About.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import Resources from "./pages/Resources.jsx";
import MealPlans from "./pages/MealPlansPage.jsx";
import ExplorePastTrips from "./pages/ExplorePastTrips.jsx";
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
          <Route path="/plan" element={<CreatePlan />}></Route>
          <Route path="/resources" element={<Resources />}></Route>
          <Route path="/mealplans" element={<MealPlans />}></Route>
          <Route path="/explore" element={<ExplorePastTrips />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

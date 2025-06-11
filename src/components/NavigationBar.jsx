import { Link } from "react-router-dom";
import "./component_styles/NavigationBar.css";

function NavigationBar() {
  return (
    <>
      <div className="container">
        <div className="left-content">
          <h3>TrailPlanner</h3>
        </div>
        <div className="center-content">
          <Link to="/">Home</Link>
          <Link to="/about">About Page</Link>
          <Link to="/plan">Make a Plan</Link>
          <Link to="/explore">Explore Past Trips</Link>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

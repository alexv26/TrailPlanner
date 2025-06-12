import { Link } from "react-router-dom";
import styles from "./component_styles/NavigationBar.module.css";

function NavigationBar() {
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["left-content"]}>
          <h3>TrailPlanner</h3>
        </div>
        <div className={styles["center-content"]}>
          <Link to="/">Home</Link>
          <Link to="/about">About Page</Link>
          <Link to="/plan">Make a Plan</Link>
          <Link to="/explore">Explore Past Trips</Link>
          <Link to="/resources">Resources</Link>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

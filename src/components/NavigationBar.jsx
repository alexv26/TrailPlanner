import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";

import styles from "./component_styles/NavigationBar.module.css";
import { useAuth } from "./AuthProvider";

function NavigationBar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // this removes token and sets user to null
  };

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

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
        <div className={styles["right-content"]}>
          {isLoggedIn ? (
            <div className={styles["dropdown-wrapper"]}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={styles["profile-icon-button"]}
              >
                <p>{user?.username}</p>
                <UserCircle size={28} />
              </button>
              {dropdownOpen && (
                <div className={styles["dropdown-menu"]}>
                  <Link to="/profile">View Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loginButton}>
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

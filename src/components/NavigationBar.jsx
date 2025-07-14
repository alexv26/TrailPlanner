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
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <h3>TrailPlanner</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/plan">Make a Plan</Link>
          <Link to="/explore">Trip Gallery</Link>
          <Link to="/resources">Resources</Link>
        </div>
        <div className={styles.centerContent}></div>
        <div className={styles.rightContent}>
          {isLoggedIn ? (
            <div className={styles.dropdownWrapper}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={styles.profileIconButton}
              >
                <p>{user?.username}</p>
                <UserCircle size={28} />
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/profile">View Profile</Link>
                  {user && user.role === "Admin" && (
                    <Link to="/admin">Admin Homepage</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.loginButton}>
              <Link to="/login">Login/Signup</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

// NavigationBar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";

import styles from "./component_styles/NavigationBar.module.css";
import { useAuth } from "./AuthProvider";

function NavigationBar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [linksDropdownOpen, setLinksDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // this removes token and sets user to null
  };

  useEffect(() => {
    setProfileDropdownOpen(false);
    setLinksDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (profileDropdownOpen) {
      setLinksDropdownOpen(false);
    }
  }, [profileDropdownOpen]);
  useEffect(() => {
    if (linksDropdownOpen) {
      setProfileDropdownOpen(false);
    }
  }, [linksDropdownOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1016) {
        setLinksDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSpacer}>
          <div className={styles.logo}>
            <h3>TrailPlanner</h3>
          </div>
        </div>
        <div className={styles.linksWrapper}>
          <div className={styles.hamburgerMenu}>
            <HamburgerMenu
              state={linksDropdownOpen}
              setState={setLinksDropdownOpen}
            />
          </div>
          <div
            className={`${styles.links} ${
              linksDropdownOpen ? styles.linksDropdownOpen : ""
            }`}
          >
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/plan">Make a Plan</Link>
              </li>
              <li>
                <Link to="/explore">Trip Gallery</Link>
              </li>
              <li>
                <Link to="/resources">Resources</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.rightSpacer}>
          <div className={styles.rightContent}>
            {isLoggedIn ? (
              <div className={styles.dropdownWrapper}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className={styles.profileIconButton}
                >
                  <p>{user?.username}</p>
                  <UserCircle size={28} />
                </button>
                {profileDropdownOpen && (
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
              <div className={styles.accountButtons}>
                <div className={styles.loginButton}>
                  <Link to="/account-management/login">Login</Link>
                </div>
                <div className={styles.signupButton}>
                  <Link to="/account-management/signup">Sign up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;

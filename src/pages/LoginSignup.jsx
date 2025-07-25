import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import styles from "./page_styles/LoginSignup.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
export default function LoginSignup() {
  const navigate = useNavigate();
  const { inputMode } = useParams();
  console.log("Mode:", inputMode);
  const [mode, setMode] = useState(inputMode);
  const [warning, setWarning] = useState("");
  const location = useLocation();
  const from = location.state?.from || "/plan";
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    role: "User",
    lastLogin: "",
    dateCreated: "",
    userImg: "",
    userBio: "",
    trips: [],
    savedTrips: [],
  });

  useEffect(() => {
    setWarning("");
  }, [mode]); // content in [] is what triggers useEffect. when it changes, useEffect is triggered.

  const { login } = useAuth();

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const switchMode = () => {
    setMode((prevMode) => (prevMode === "login" ? "signup" : "login"));
  };

  useEffect(() => {
    setMode(inputMode);
  }, [inputMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "login" : "signup";
    /*const currentDate = new Date().toLocaleDateString();
    if (endpoint === "signup") {
      setUser((prevUser) => ({
        ...prevUser,
        dateCreated: currentDate,
      }));
    }
    if (endpoint === "login") {
      setUser((prevUser) => ({
        ...prevUser,
        lastLogin: currentDate,
      }));
    }*/

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Request failed");

      // ✅ Update auth context
      login({ ...data.userData, token: data.token });

      /* ✅ Navigate to previous root. say we clicked on "/profile". it will redirect to login page, then after successful login it
      will redirect to the "from" location */
      navigate(from, { replace: true });

      // Navigate or update state as needed
    } catch (err) {
      console.error(err);
      setWarning(err.message || "An error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
          <h1>{mode == "signup" ? "Sign Up" : "Log in"}</h1>
        </div>
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <div className={styles.inputField}>
                <label>
                  First name:
                  <input
                    name="firstName"
                    value={user.firstName}
                    onChange={handleAccountChange}
                    placeholder="Enter your first name"
                    required
                  />
                </label>
              </div>
              <div className={styles.inputField}>
                <label>
                  Last name:
                  <input
                    name="lastName"
                    value={user.lastName}
                    onChange={handleAccountChange}
                    placeholder="Enter your last name"
                    required
                  />
                </label>
              </div>
              <div className={styles.inputField}>
                <label>
                  Email:
                  <input
                    name="email"
                    value={user.email}
                    onChange={handleAccountChange}
                    placeholder="Enter your email"
                    required
                  />
                </label>
              </div>
            </>
          )}

          <div className={styles.inputField}>
            <label>
              Username:
              <input
                name="username"
                value={user.username}
                onChange={handleAccountChange}
                placeholder="Enter your username"
                required
              />
            </label>
          </div>

          <div className={styles.inputField}>
            <label>
              Password:
              <input
                name="password"
                type="password"
                value={user.password}
                onChange={handleAccountChange}
                placeholder="Enter your password"
                required
              />
            </label>
          </div>
          {!!warning && (
            <div className={styles.warning}>
              <p>{warning}</p>
            </div>
          )}

          <div className={styles.submitButton}>
            <button type="submit" onClick={handleSubmit}>
              {mode == "signup" ? "Sign Up" : "Log in"}
            </button>
          </div>
        </form>

        <div className={styles.switchMode}>
          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <a onClick={switchMode}>
            {mode === "login" ? "Sign up now." : "Login now."}
          </a>
        </div>
      </div>
    </div>
  );
}

import styles from "./component_styles/ProfileTile.module.css";
import { useAuth } from "./AuthProvider";
import TripGallery from "./TripGallery";

export default function ProfileTile() {
  const { user } = useAuth();
  return (
    <>
      <div className={styles.flexwrapper}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>Welcome {user?.firstName}!</h1>

            <hr className={styles.separator} />

            <div className={styles.userinfo}>
              <h2>Username: {user?.username}</h2>
              <h2>Email: {user?.email}</h2>
              <h2>User Affiliation (Permission): {user?.role}</h2>
              <h2>Bio:</h2>
              <textarea rows="5" readOnly value={user?.userBio} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

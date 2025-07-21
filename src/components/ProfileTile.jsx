import styles from "./component_styles/ProfileTile.module.css";
import { useAuth } from "./AuthProvider";
import TripGallery from "./TripGallery";

const showBio = false;

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
              <p>Username: {user?.username}</p>
              <p>Email: {user?.email}</p>
              <p>User Affiliation (Permission): {user?.role}</p>
              {showBio && (
                <>
                  <p>Bio:</p>
                  <textarea rows="5" readOnly value={user?.userBio} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

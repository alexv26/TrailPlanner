import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page_styles/ViewProfile.module.css";
import { useAuth } from "../components/AuthProvider";
import ProfileTile from "../components/ProfileTile.jsx";
import TripGallery from "../components/TripGallery.jsx";

import editButton from "../assets/edit-button.png";

export default function ViewProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrips, setDeletingTrips] = useState(false);
  // update UI to match db after delete
  function handleTripDeleted(deletedTripId) {
    setTrips((prevTrips) =>
      prevTrips.filter((trip) => trip._id !== deletedTripId)
    );
  }

  function handleEditTripsButton() {
    setDeletingTrips(!deletingTrips);
  }

  useEffect(() => {
    if (user?.username) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.username}`)
        .then((res) => res.json())
        .then((data) => {
          setTrips(data.trips || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user trips:", err);
          setLoading(false);
        });
    }
  }, [user?.username]);

  return (
    <>
      <ProfileTile />
      {loading ? (
        <p>Loading your trips...</p>
      ) : trips.length > 0 ? (
        <div className={styles.tripGallery}>
          <div className={styles.header}>
            <h1>MY TRIPS</h1>
            <a
              onClick={handleEditTripsButton}
              className={`${styles.editButton} ${
                deletingTrips ? styles.deleteMode : ""
              }`}
            >
              Edit
            </a>
          </div>
          <TripGallery
            trips={trips}
            pageSize={4}
            className={styles.profileGallery}
            deleteMode={deletingTrips}
            originatingLocation={"/profile"}
            onTripDeleted={handleTripDeleted}
          />
        </div>
      ) : (
        <>
          <div className={styles.tripGallery}>
            <h1>MY TRIPS</h1>
            <p>You haven't added any trips yet.</p>
          </div>
        </>
      )}
    </>
  );
}

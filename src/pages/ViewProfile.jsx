import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page_styles/ViewProfile.module.css";
import { useAuth } from "../components/AuthProvider";
import ProfileTile from "../components/ProfileTile.jsx";
import TripGallery from "../components/TripGallery.jsx";

export default function ViewProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrips, setDeletingTrips] = useState(false);
  const handleNavigate = (index, trip) => () => navigate(`/trip/${index}`);
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
      fetch(`http://localhost:3004/api/userTrips/${user.username}`)
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
          <h1>MY TRIPS</h1>
          <a
            onClick={handleEditTripsButton}
            style={{
              backgroundColor: deletingTrips ? "red" : "rgba(99, 99, 99, 0.8)",
            }}
          >
            Edit trips
          </a>
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

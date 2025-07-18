import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider.jsx";
import styles from "./page_styles/ExplorePastTrips.module.css";
import TripGallery from "../components/TripGallery.jsx";

export default function ExplorePastTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrips, setDeletingTrips] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  function handleTripDeleted(deletedTripId) {
    setTrips((prevTrips) =>
      prevTrips.filter((trip) => trip._id !== deletedTripId)
    );
  }

  function handleEditTripsButton() {
    setDeletingTrips(!deletingTrips);
  }

  useEffect(() => {
    fetch("http://localhost:3004/trips")
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load trip plans:", err);
        setLoading(false);
      });
  }, []);

  const filteredTrips = trips.filter((trip) =>
    trip?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.bodyText}>
          <h1>Trip Gallery</h1>
        </div>
        <div className={styles.adminEditButton}>
          {user && user.role === "Admin" && (
            <a
              onClick={handleEditTripsButton}
              style={{
                backgroundColor: deletingTrips ? "red" : "rgb(99, 99, 99)",
                marginBottom: "20px",
              }}
            >
              Edit trips (Admin)
            </a>
          )}
        </div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.tileGrid}>
        <TripGallery
          trips={filteredTrips}
          pageSize={8}
          deleteMode={deletingTrips}
          originatingLocation={"/explore"}
          onTripDeleted={handleTripDeleted}
        />
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider.jsx";
import styles from "./page_styles/ExplorePastTrips.module.css";
import TripGallery from "../components/TripGallery.jsx";

export default function ExplorePastTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrips, setDeletingTrips] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Dynamic tilesPerPage
  const [tilesPerPage, setTilesPerPage] = useState(() => {
    const tileWidth = 290;
    const windowSize = window.innerWidth;
    console.log("Window size:", windowSize);
    console.log("Tiles per page:", Math.floor(windowSize / tileWidth) * 2);
    return Math.floor(windowSize / tileWidth) * 2;
  }); // tile width = 250px, call it 300 to be safe. with two rows, should be able to fit
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const { user } = useAuth();

  function handlePageChange(page) {
    setSearchBarVisible(page === 1);
  }

  function handleTripDeleted(deletedTripId) {
    setTrips((prevTrips) =>
      prevTrips.filter((trip) => trip._id !== deletedTripId)
    );
  }

  function handleEditTripsButton() {
    setDeletingTrips(!deletingTrips);
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trips`)
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

  /* handling tilesPerPage so it dynamically changes for larger screens. 
  Rule of thumb: each page should have two rows of trips with equal parts betwee, so that one row doesnt have 1000000 trips and the other only 1
  */
  useEffect(() => {
    const handleResize = () => {
      const tileWidth = 290;
      const windowSize = window.innerWidth;
      const tpp = Math.floor(windowSize / tileWidth) * 2;
      setTilesPerPage(tpp);
    };

    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
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
      {searchBarVisible && (
        <div className={styles.searchBar}>
          <h1>Search Trips</h1>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Search by location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>
      )}

      <div className={styles.tileGrid}>
        <TripGallery
          trips={filteredTrips}
          pageSize={tilesPerPage}
          deleteMode={deletingTrips}
          originatingLocation={"/explore"}
          onTripDeleted={handleTripDeleted}
          onPageChange={handlePageChange}
        />
      </div>

      {user && user.role === "Admin" && (
        <div className={styles.adminEditButton}>
          <a
            onClick={handleEditTripsButton}
            style={{
              backgroundColor: deletingTrips ? "red" : "rgb(99, 99, 99)",
              marginBottom: "20px",
            }}
          >
            Edit trips (Admin)
          </a>
        </div>
      )}
    </>
  );
}

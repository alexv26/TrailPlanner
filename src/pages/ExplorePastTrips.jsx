import { useEffect, useState } from "react";
import styles from "./page_styles/ExplorePastTrips.module.css";
// ExplorePastTrips.jsx
import TripGallery from "../components/TripGallery.jsx";

export default function ExplorePastTrips() {
  const [tripPlans, setTripPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3004/trips")
      .then((res) => res.json())
      .then((data) => {
        setTripPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load trip plans:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading trips...</p>;

  return (
    <>
      <div className={styles.tileGrid}>
        <TripGallery trips={tripPlans} pageSize={8} />
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./page_styles/ExplorePastTrips.module.css";

const PAGE_SIZE = 8;

export default function ExplorePastTrips() {
  const [tripPlans, setTripPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

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

  const totalPages = Math.ceil(tripPlans.length / PAGE_SIZE);
  const currentTrips = tripPlans.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const calculateTripLength = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  const renderPageButtons = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const middlePages = [
        Math.max(2, page - 1),
        page,
        Math.min(totalPages - 1, page + 1),
      ].filter((p, i, self) => self.indexOf(p) === i);
      pages.push(...middlePages);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, i) =>
      typeof p === "number" ? (
        <button
          key={i}
          className={`${styles.pageButton} ${page === p ? styles.active : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ) : (
        <span key={i} className={styles.ellipsis}>
          …
        </span>
      )
    );
  };

  if (loading) return <p>Loading trips...</p>;

  return (
    <div>
      <div className={styles.tileGrid}>
        {currentTrips.map((trip, index) => (
          <div
            key={index}
            className={styles.tripTile}
            onClick={() => navigate(`/trip/${(page - 1) * PAGE_SIZE + index}`)}
          >
            {trip.placeholderImg ? (
              <img
                src={trip.placeholderImg}
                alt={trip.tripName}
                className={styles.tileImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>No image available</div>
            )}
            <h3>{trip.tripName}</h3>
            <p>{calculateTripLength(trip.startDate, trip.endDate)}</p>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(1)} disabled={page === 1}>
          First
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        {renderPageButtons()}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
}

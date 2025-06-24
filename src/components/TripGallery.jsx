// TripGallery.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TripTile from "./TripTile"; // Import the new component
import styles from "./component_styles/TripGallery.module.css";

export default function TripGallery({ trips, pageSize = 8, className = "" }) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(trips.length / pageSize);
  const currentTrips = trips.slice((page - 1) * pageSize, page * pageSize);

  const renderPageButtons = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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

  return (
    <div>
      <div className={`${styles.tileGrid} ${className}`}>
        {currentTrips.map((trip, index) => (
          <TripTile
            key={index}
            trip={trip}
            onClick={() => navigate(`/trip/${(page - 1) * pageSize + index}`)}
          />
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

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TripTile from "./TripTile";
import styles from "./component_styles/TripGallery.module.css";

export default function TripGallery({
  trips,
  pageSize = 8,
  className = "",
  deleteMode = false,
  originatingLocation = "/explore",
}) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(trips.length / pageSize);
  const currentTrips = trips.slice((page - 1) * pageSize, page * pageSize);

  // Default click behavior: navigate to trip detail
  const handleClick = deleteMode
    ? (index, trip) => () => console.log("Deleting trip", trip)
    : (index, trip) => () =>
        navigate(`/trip`, { state: { trip, from: originatingLocation } });

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
        {currentTrips.map((trip, index) => {
          const globalIndex = (page - 1) * pageSize + index;
          return (
            <TripTile
              key={trip.id || index}
              trip={trip}
              deleteMode={deleteMode}
              onClick={handleClick(globalIndex, trip)}
            />
          );
        })}
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

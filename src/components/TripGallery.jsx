import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TripTile from "./TripTile";
import styles from "./component_styles/TripGallery.module.css";
import { useAuth } from "./AuthProvider";

export default function TripGallery({
  trips,
  pageSize = 8,
  className = "",
  deleteMode = false,
  originatingLocation = "/explore",
  onTripDeleted,
  onPageChange,
}) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const [totalPages, setTotalPages] = useState(
    Math.ceil(trips.length / pageSize)
  );
  const currentTrips = trips.slice((page - 1) * pageSize, page * pageSize);

  const [confirmingTripId, setConfirmingTripId] = useState(null);

  useEffect(() => {
    if (onPageChange) {
      onPageChange(page); // Notify parent whenever page changes
    }
  }, [page, onPageChange]);

  const handleClick = deleteMode
    ? (index, trip) => () => {
        if (confirmingTripId === trip._id) {
          deleteTrip(trip);
        } else {
          setConfirmingTripId(trip._id);
        }
      }
    : (index, trip) => () =>
        navigate(`/viewplan/${trip._id}`, {
          state: { from: originatingLocation },
        });

  async function deleteTrip(trip) {
    console.log("deleting trip with trip id:", trip._id);

    // Delete from user DB
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/${
        user.username
      }/trips/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trip.createdBy, tripId: trip._id }),
      }
    );

    // delete from trips DB
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/trips/${trip._id}/delete`,
      {
        method: "DELETE",
      }
    );

    setConfirmingTripId(null); // Reset after deletion

    // update UI to match db after delete
    if (onTripDeleted) {
      onTripDeleted(trip._id);
    }
  }

  const renderPageButtons = () => {
    if (totalPages === 0) return null;

    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      if (page > 3) pages.push("...");

      for (
        let j = Math.max(2, page - 1);
        j <= Math.min(totalPages - 1, page + 1);
        j++
      ) {
        pages.push(j);
      }

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages); // Always show last page
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

  useEffect(() => {
    const newTotal = Math.ceil(trips.length / pageSize);
    setTotalPages(newTotal);

    if (newTotal === 0) {
      setPage(1);
    } else if (page > newTotal) {
      setPage(newTotal);
    }
  }, [trips.length, pageSize, page]);

  return (
    <div>
      <div className={`${styles.tileGrid} ${className}`}>
        {currentTrips.map((trip, index) => {
          const globalIndex = (page - 1) * pageSize + index;
          return (
            <TripTile
              key={trip._id || index}
              trip={trip}
              deleteMode={deleteMode}
              confirming={confirmingTripId === trip._id}
              onCancelConfirm={() => setConfirmingTripId(null)}
              onClick={handleClick(globalIndex, trip)}
            />
          );
        })}
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          {"<"}
        </button>
        {renderPageButtons()}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

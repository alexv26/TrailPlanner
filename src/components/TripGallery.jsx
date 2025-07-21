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

  const totalPages = Math.ceil(trips.length / pageSize);
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
        navigate(`/trip`, { state: { trip, from: originatingLocation } });

  async function deleteTrip(trip) {
    console.log("deleting trip with trip id:", trip._id);

    // Delete from user DB
    await fetch("http://localhost:3004/api/userTrips", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: trip.createdBy, tripId: trip._id }),
    });

    // delete from trips DB
    await fetch(`http://localhost:3004/trips/${trip._id}`, {
      method: "DELETE",
    });

    setConfirmingTripId(null); // Reset after deletion

    // update UI to match db after delete
    if (onTripDeleted) {
      onTripDeleted(trip._id);
    }
  }

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

  useEffect(() => {
    if (page != 1) {
      localStorage.setItem("showTripGallerySearchBar", false);
    } else {
      localStorage.setItem("showTripGallerySearchBar", true);
    }
  }, [page]);

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

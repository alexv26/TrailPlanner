// TripTile.jsx
import styles from "./component_styles/TripGallery.module.css";

export default function TripTile({
  trip,
  onClick,
  deleteMode = false,
  confirming = false,
  onCancelConfirm,
}) {
  const calculateTripLength = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <div
      className={styles.tripTile}
      onClick={!confirming ? onClick : undefined}
    >
      {trip.placeholderImg ? (
        <div className={styles.imageWrapper}>
          <img
            src={trip.placeholderImg}
            alt={trip.tripName}
            className={styles.tileImage}
          />
          {deleteMode && <div className={styles.overlay}>x</div>}
        </div>
      ) : (
        <div className={styles.imagePlaceholder}>No image available</div>
      )}
      {confirming && deleteMode ? (
        <>
          <h3>Are you sure you want to delete this trip?</h3>
          <div className={styles.deleteConfirmButtons}>
            <button onClick={onCancelConfirm} className={styles.noButton}>
              No
            </button>
            <button onClick={onClick} className={styles.yesButton}>
              Yes
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>{trip.tripName}</h3>
          <p>
            <strong>Location:</strong> {trip.location}
          </p>
          <p>
            <strong>Difficulty:</strong> {trip.difficulty}
          </p>
          <p>
            <strong>Tip Length: </strong>
            {calculateTripLength(trip.startDate, trip.endDate)}
          </p>
        </>
      )}
    </div>
  );
}

// TripTile.jsx
import styles from "./component_styles/TripGallery.module.css";

export default function TripTile({ trip, onClick }) {
  const calculateTripLength = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <div className={styles.tripTile} onClick={onClick}>
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
  );
}

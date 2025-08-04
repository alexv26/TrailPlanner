import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./page_styles/TripDetails.module.css";

import formFields from "../resources/formFields.json";

export default function TripDetails() {
  const location = useLocation();
  const { inTrip, from } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(inTrip || null);

  const handleCopyPlan = () => {
    const { startDate, endDate, ...updatedTripForCopying } = trip;
    navigate("/plan", { state: { trip: updatedTripForCopying } });
  };

  function convertDate(releaseDate) {
    const [year, month, day] = releaseDate.split("-");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const dayNumber = parseInt(day, 10);
    return `${months[monthIndex]} ${dayNumber}, ${year}`;
  }

  useEffect(() => {
    if (!inTrip && id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trips/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTrip(data);
        })
        .catch((err) => {
          console.error("Failed to load trip details:", err);
        });
    }
  }, [inTrip, id]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.tripDetailsContainer}>
      <div className={styles.tile}>
        <h1 className={styles.title}>{trip["tripName"]}</h1>
        <div className={`${styles.buttons} hide-when-printing`}>
          <button
            onClick={() => navigate(from)}
            className={`${styles.customButton} hide-when-printing`}
          >
            {"< Back"}
          </button>
          <button
            onClick={() => handleCopyPlan()}
            className={styles.customButton}
          >
            Copy Trip Plan
          </button>
          <button
            onClick={() => window.print()}
            className={styles.customButton}
          >
            Print Trip Plan
          </button>
        </div>
        {Object.entries(formFields).map(([pageTitle, fields]) => (
          <div key={pageTitle}>
            {Object.entries(fields).map(([fieldKey, fieldData]) => {
              if (fieldKey === "header") {
                return (
                  <h2 key={fieldKey} className={styles.miniHeader}>
                    {fieldData}
                  </h2>
                );
              }

              const fieldValue = trip[fieldKey] ?? "(not provided)";
              return (
                <div key={fieldKey} className={styles.fieldContent}>
                  <strong>{fieldData.label}:</strong> {fieldValue.toString()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

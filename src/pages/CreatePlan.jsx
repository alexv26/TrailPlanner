import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import objectId from "bson-objectid";
import jsPDF from "jspdf";
import styles from "./page_styles/CreatePlan.module.css";

const showMockButton = false;

const mockFormData = {
  tripName: "Day Hike to Mount Lafayette",
  leaders: "Alex Velsmid and Thomas Gregory",
  startDate: "2025-07-15",
  endDate: "2025-07-15",
  groupSize: "8",
  emergencyContact: `Alexander Velsmid: 123-274-2927\nThomas Gregory: 198-384-2842`,
  permits: "White Mountain National Forest Day Pass - $5 per vehicle",
  difficulty: "Hard",
  allTrailsLink:
    "https://www.alltrails.com/trail/us/new-hampshire/mount-lafayette",
  trailhead: "Mount Lafayette via Old Bridle Path",
  distanceGain: "7.6 mi",
  elevationGain: "3,526 ft",
  activityTime: "5h 55m",
  topoMap: "",
  departure: "7:00 AM from the Outdoor Adventures office",
  returnTime: "5:30 PM",
  mealBreaks:
    "Lunch at the summit around 12:30 PM; snack break at Greenleaf Hut",
  overnightPlans: "N/A (day trip)",
  backupExit: "Descend early via Falling Waters Trail if weather deteriorates",
  mealPlan: `Lunch:\n- Turkey sandwiches\n- Pringles\n- Trail mix\n\nDinner:\n- N/A\n\nSnacks:\n- Energy bars\n- Electrolyte drink mix`,
  weatherPlan:
    "If thunderstorms are forecast, trip will be rescheduled or alternate route chosen below tree line.",
  injuryPlan:
    "Injured person escorted down by 1 leader, group splits 6/2. Contact emergency services if needed.",
  lateReturn:
    "Notify OA advisor by 6:30 PM if group hasn't returned; follow delayed return protocol.",
  altRoute:
    "https://www.alltrails.com/trail/us/new-hampshire/lonesome-lake-trail\nShorter and safer in poor weather.",
  trailheadAddress: "mtn rd",
  nearestHospital: "here",
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

  const monthIndex = parseInt(month, 10) - 1; // convert "01" to 0-based index
  const monthName = months[monthIndex];

  // Remove leading zero from day if present
  const dayNumber = parseInt(day, 10);

  return `${monthName} ${dayNumber}, ${year}`;
}

// Form fields for each page. Each key corresponds to a page title, and each value are the fields for that page
//! Need to add automation script to each field where it applies
import formFields from "../resources/formFields.json";

export default function CreatePlan() {
  const finalPage = Object.keys(formFields).length + 1;
  const [page, setPage] = useState(() => {
    const stored = localStorage.getItem("page");
    if (stored) {
      try {
        return parseInt(stored, 10);
      } catch (e) {
        console.error("Failed to parse stored formData:", e);
      }
    }
    return 1;
  });

  const { state } = useLocation();
  const navigate = useNavigate();
  const tripData = state?.trip || {};
  const { user } = useAuth();
  const initialForm = Object.values(formFields)
    .flatMap((section) => Object.keys(section))
    .reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});

  // Merge trip data into the initial form

  const [formData, setFormData] = useState(() => {
    const stored = localStorage.getItem("formData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored formData:", e);
      }
    }
    return {
      ...initialForm,
      ...tripData,
    };
  });

  // save formData on when formData changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  // save page num in localStorage
  useEffect(() => {
    localStorage.setItem("page", JSON.stringify(page));
  }, [page]);

  const location = useLocation();
  // reset formData and pagewhen changing out of "create plan" page
  const prevPathRef = useRef(location.pathname);

  const [publishForm, setPublishForm] = useState(false);

  const getRandomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function assignImage() {
    const randomNum = getRandomInteger(1, 26);
    return `${randomNum}.jpg`;
  }

  async function fetchTrailheadInfo(trailName) {
    if (!trailName) {
      console.warn("No trail name provided.");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/trails/info?name=${encodeURIComponent(trailName)}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Server responded with error:",
          data.error || response.statusText
        );
        return;
      }

      if (data && (data.name || data.address)) {
        const fullTrailheadAddress = `${data.location.lat},${data.location.lng}\n${data.address}`;
        setFormData((prev) => ({
          ...prev,
          trailheadAddress: fullTrailheadAddress || "",
        }));
      } else {
        console.warn("No trailhead data returned. Using fallback name.");
        setFormData((prev) => ({
          ...prev,
          trailhead: trailName,
          trailheadAddress: "",
        }));
      }
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  }

  function sortHospitals(hospitals, lat, lng) {
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 3958.8; // Earth radius in miles
      const toRad = (deg) => (deg * Math.PI) / 180;

      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in miles
    }

    const excludeTerms = [
      "va",
      "chiropractor",
      "chiropractic",
      "surgeon",
      "surgery",
      "birthing",
      "orthopedics",
      "sports medicine",
      "physical therapy",
    ];

    return hospitals
      .filter((hospital) => {
        const name = hospital.name?.toLowerCase() || "";
        return (
          hospital.rating >= 3.5 &&
          !excludeTerms.some((term) => name.includes(term))
        );
      })
      .map((hospital) => {
        const hLat = hospital.geometry.location.lat;
        const hLng = hospital.geometry.location.lng;
        const distance = haversine(lat, lng, hLat, hLng);
        return { ...hospital, distance_mi: distance };
      })
      .sort((a, b) => a.distance_mi - b.distance_mi);
  }

  function formatHospitalText(hospitals, index) {
    const hospital = hospitals[index];
    const text = `Name: ${hospital.name}\nAddress: ${
      hospital.vicinity
    }\nDistance from Trailhead: ${hospital.distance_mi.toFixed(
      2
    )} miles\nRating: ${hospital.rating}`;
    return text;
  }

  async function fetchNearestHospitals(trailheadAddress) {
    if (!trailheadAddress) {
      console.warn("No trail address provided.");
      return;
    }

    try {
      // Split by newline to separate coordinates from address
      const [coords] = trailheadAddress.split("\n");

      // Split coordinates by comma
      const [lat, lng] = coords.split(",");

      // Now lat and lng are separate variables

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/healthcare/nearby-hospitals?lat=${lat}&lng=${lng}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Server responded with error:",
          data.error || response.statusText
        );
        return;
      }
      if (data) {
        // Sort data in accordance to distance:
        const sortedData = sortHospitals(data, lat, lng);
        // return top 5 hospitals

        const topFiveHospitalsText = sortedData
          .slice(0, 5) // Get the first 5 hospitals
          .map((_, index) => formatHospitalText(sortedData, index)) // Format each one
          .join("\n\n"); // Add spacing between each hospital
        setFormData((prev) => ({
          ...prev,
          nearestHospital: topFiveHospitalsText || "",
        }));
      }
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  }

  async function generateMealPlan() {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = end - start;
    const num_days = diffTime / (1000 * 60 * 60 * 24) + 1;
    const num_nights = num_days - 1;
    const num_participants = parseInt(formData.groupSize, 10);

    // Show loading feedback
    setFormData((prev) => ({
      ...prev,
      mealPlan: "Generating meal plan...",
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/meal-plans/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          body: JSON.stringify({
            num_nights,
            num_participants,
            timestamp: Date.now(), // force freshness
          }),
        }
      );

      const data = await response.json();

      // Check if the response contains mealPlan or result
      let mealPlan;
      if (data.mealPlan) {
        // This matches the updated Express server structure
        mealPlan = data.mealPlan;
      } else if (typeof data.result === "string") {
        // Fallback to old expected structure
        mealPlan = data.result;
      } else {
        // Handle other cases (like error responses)
        throw new Error("Invalid response format");
      }

      // Post-processing: extract only the relevant days
      const startIndex = mealPlan.indexOf("Day 1:");
      const trimmedTop =
        startIndex !== -1 ? mealPlan.slice(startIndex) : mealPlan;

      const cutPhrase = `Day ${num_days + 1}:`;
      const endIndex = trimmedTop.indexOf(cutPhrase);
      const trimmedMealPlan =
        endIndex !== -1 ? trimmedTop.slice(0, endIndex).trim() : trimmedTop;

      setFormData((prev) => ({
        ...prev,
        mealPlan: trimmedMealPlan || "No valid meal plan generated.",
      }));
    } catch (err) {
      console.error("Failed to generate meal plan:", err);
      setFormData((prev) => ({
        ...prev,
        mealPlan: "Failed to generate meal plan. Please try again.",
      }));
    }
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckbox = (e) => {
    setPublishForm(e.target.checked);
  };

  const handleNext = (e) => {
    e.preventDefault();

    const form = e.target.form;
    if (!form.checkValidity()) {
      form.reportValidity(); // Triggers native HTML validation UI
      return;
    }

    if (page === 2) {
      if (formData.startDate === formData.endDate) {
        setPage((prev) => prev + 2);
      } else {
        setPage((prev) => prev + 1);
      }
    } else {
      setPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (page == 4) {
      if (formData.startDate === formData.endDate) {
        setPage((prev) => prev - 2);
      } else {
        setPage((prev) => prev - 1);
      }
    } else {
      setPage((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);

    const imgUrl = `src/assets/outdoor_photos/${assignImage()}`; // future: allow user upload
    const { _id, ...rest } = formData;
    const generatedId = objectId(); // pre-generating a shared ID

    const updatedFormData = {
      ...rest,
      placeholderImg: imgUrl,
      createdBy: user?.username,
      _id: generatedId.toString(),
    };

    let successful = true;

    // Step 1: Publish to public DB (if chosen)
    if (publishForm) {
      const { emergencyContact, leaders, campsitePrice, ...anonymousFormData } =
        updatedFormData;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/trips/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(anonymousFormData),
          }
        );

        if (!response.ok) throw new Error("Failed to submit trip to public DB");
        console.log("✅ Public trip saved.");
      } catch (error) {
        successful = false;
        console.error("❌ Error submitting public trip:", error);
        alert("Error submitting your trip to the public database.");
      }
    }

    // Step 2: Save to user's private trip list
    try {
      const userTripResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${
          user?.username
        }/trips/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newTrip: updatedFormData,
          }),
        }
      );

      if (!userTripResponse.ok)
        throw new Error("Failed to save trip to user profile");

      console.log("✅ Trip also saved to user profile!");

      // Step 3: Redirect to /viewplan/:id
      if (successful) {
        navigate(`/viewplan`, {
          state: { inTrip: updatedFormData, from: "/" },
        });
      }
    } catch (error) {
      console.error("❌ Error saving to user profile:", error);
      alert("There was an error saving your trip. Please try again.");
    }
  };

  // TODO: Implement APIs
  useEffect(() => {
    const name = formData.trailhead;
    if (page !== 4 || !name || name.length < 3 || formData.trailheadAddress)
      return;

    const delay = 800;
    const handler = setTimeout(() => {
      fetchTrailheadInfo(name);
    }, delay);

    return () => clearTimeout(handler);
  }, [formData.trailhead, page]);

  const hasFetchedHospitals = useRef(false);
  useEffect(() => {
    if (
      page === 7 &&
      formData.trailheadAddress &&
      !hasFetchedHospitals.current &&
      !formData.nearestHospital
    ) {
      fetchNearestHospitals(formData.trailheadAddress);
      hasFetchedHospitals.current = true;
    }
  }, [page, formData.trailheadAddress]);

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.header}>
        {page != finalPage ? formFields[page]?.header : "Before you Submit..."}
      </h1>
      {showMockButton && (
        <button
          type="button"
          onClick={() => setFormData(mockFormData)}
          className="btn btn-info"
        >
          Mock Data
        </button>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        {Object.entries(formFields[page] || {}).map(([key, field]) => (
          <div key={key} className={styles.formGroup}>
            {field.type !== "checkbox" && (
              // If checkbox, the label is handled in the input
              <label htmlFor={key} className={styles.label}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
            )}
            {field.type === "textarea" ? (
              <textarea
                id={key}
                name={key}
                rows={field.rows || 3}
                placeholder={field.placeholder}
                value={formData[key] || ""}
                onChange={handleChange}
                required={field.required}
              />
            ) : field.type === "select" ? (
              <select
                id={key}
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                required={field.required}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "select" ? (
              <select
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={styles["custom-select"]}
              ></select>
            ) : field.type === "checkbox" ? (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key]}
                  onChange={handleChange}
                  required={field.required}
                />
                {field.label}
              </label>
            ) : field.type == null ? null : (
              <input
                id={key}
                name={key}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[key] || ""}
                onChange={handleChange}
                required={field.required}
              />
            )}
          </div>
        ))}

        {page === finalPage && (
          <div className={styles.publishSection}>
            <p>
              Thank you for filling out your trip plan! To view your plan,
              please press submit. If you would be willing to share your plan
              with others, please click on the checkbox to publish the plan.
              This plan can be accessed from your profile, and can be deleted
              from your profile and the public database at any point.
            </p>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={publishForm}
                onChange={handleCheckbox}
              />
              Publish this trip plan to the public database
            </label>
            <p
              style={{
                color: "yellow",
                fontWeight: "bold",
              }}
            >
              Note: names and emergency contact info is removed if you chose to
              share your trip plan.
            </p>
          </div>
        )}
        <div className={styles.formNavigation}>
          {page > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
            >
              Back
            </button>
          )}
          {page < finalPage ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          ) : (
            <>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

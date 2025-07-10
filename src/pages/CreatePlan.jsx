import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import objectId from "bson-objectid";
import jsPDF from "jspdf";
import styles from "./page_styles/CreatePlan.module.css";

const showMockButton = true;

const emergencyContactPlaceholder =
  "e.g. \nAlexander Velsmid: 123-274-2927 \nThomas Gregory: 198-384-2842";
const mealPlanPlaceholder =
  "e.g.\nLunch:\n1.5lb Turkey\n1lb american cheese\nPringles\n\nDinner:\nPasta\nRed Sauce\nPesto";

const weatherContingencyPlaceholder =
  "Insert contingency plan for unsatisfactory/unsafe weather here";
const injuryContingencyPlaceholder = "Insert contingency plan for injury here";
const lateReturnProtocolPlaceholder = "Insert plan for late return here";
const alternativeRoutePlaceholder =
  "Insert possible alternative routes here. This can be an alltrails link with a brief description.";

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

function CreatePlan() {
  const finalPage = 7;
  const [page, setPage] = useState(1);
  const { state } = useLocation();
  const tripData = state?.trip || {};
  const { user } = useAuth();
  const initialForm = {
    createdBy: "",
    tripName: "",
    leaders: "",
    startDate: "",
    endDate: "",
    location: "",
    groupSize: "",
    emergencyContact: "",
    permits: "",
    difficulty: "",
    allTrailsLink: "",
    trailhead: "",
    trailheadAddress: "",
    trailheadParking: "",
    distanceGain: "",
    elevationGain: "",
    activityTime: "",
    topoMap: "",
    departure: "",
    returnTime: "",
    mealBreaks: "",
    overnightPlans: "",
    backupExit: "",
    mealPlan: "",
    weatherPlan: "",
    injuryPlan: "",
    lateReturn: "",
    altRoute: "",
    campsiteName: "",
    campsiteHasBathrooms: "",
    campsitePrice: "",
    campsiteAddress: "",
    nearestHospital: "",
    placeholderImg: "",
  };

  // Merge trip data into the initial form

  const [formData, setFormData] = useState(() => {
    return {
      ...initialForm,
      ...tripData,
    };
  });

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
        `http://localhost:${
          import.meta.env.VITE_TRAIL_INFO_API_PORT
        }/trailhead?name=${encodeURIComponent(trailName)}`
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
        `http://localhost:${
          import.meta.env.VITE_NEAREST_HOSPITAL_API_PORT
        }/nearby-hospitals?lat=${lat}&lng=${lng}`
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
      const response = await fetch("http://localhost:3003/generate-meal-plan", {
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
      });

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
    const imgUrl = `src/assets/outdoor_photos/${assignImage()}`;

    // removing id so there are no duplicates in DB
    const { _id, ...rest } = formData;

    const generatedId = objectId();

    const updatedFormData = {
      ...rest,
      placeholderImg: imgUrl,
      createdBy: user?.username,
      _id: generatedId.toString(),
    };

    //setFormData(updatedFormData);

    if (publishForm) {
      console.log("Placeholder img:", imgUrl);

      // Removing names and emergency contact so leaders stay anonymous
      const { emergencyContact, leaders, campsitePrice, ...anonymousFormData } =
        updatedFormData;

      try {
        // 1. Post to trips DB
        const response = await fetch("http://localhost:3004/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(anonymousFormData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit trip plan");
        }

        console.log("✅ Trip plan submitted successfully!"); // 2. Add trip to user's personal trip list
      } catch (error) {
        console.error("❌ Error submitting trip plan:", error);
        alert(
          "There was an error submitting your trip plan. Please try again."
        );
      }
    }

    try {
      // 2. Update user's personal trips
      const userTripResponse = await fetch(
        "http://localhost:3004/api/userTrips",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username, // make sure `user` is available in scope
            newTrip: updatedFormData, // store as string if needed
          }),
        }
      );

      if (!userTripResponse.ok) {
        throw new Error("Failed to save trip to user profile");
      }

      console.log("✅ Trip also saved to user profile!");
    } catch (error) {
      console.error("❌ Error submitting trip plan:", error);
      alert("There was an error submitting your trip plan. Please try again.");
    }
  };

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

  useEffect(() => {
    if (page === 8) {
      generatePDF(formData);
    }
  }, [page]);

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

  async function generatePDF(formData) {
    const doc = new jsPDF();
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const maxWidth = 180;
    let y = margin;

    const drawLine = () => {
      doc.setDrawColor(200);
      doc.line(margin, y, pageHeight - margin, y);
      y += 5;
    };

    const addHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.text(formData.tripName, margin, y);
      y += 10;
    };

    const addSectionTitle = (title) => {
      // Add extra space before section title
      y += 5; // increase this value as needed
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.text(title, margin, y);
      y += 6;
      doc.setTextColor(0, 0, 0);
    };

    const addText = (label, value) => {
      if (!value) value = "N/A";

      // Split manually by line breaks first
      const paragraphs = value.split("\n");
      let totalHeight = 5; // For label

      // Calculate how much space all wrapped lines will take
      const wrappedLines = paragraphs.map((p) =>
        doc.splitTextToSize(p, maxWidth)
      );
      wrappedLines.forEach((lines) => {
        totalHeight += lines.length * 6;
      });

      // Add page if needed
      if (y + totalHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // Draw label

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      if (label) {
        doc.text(`${label}:`, margin, y);
        y += 5;
      }

      // Draw wrapped lines
      doc.setFont("helvetica", "normal");
      wrappedLines.forEach((lines) => {
        doc.text(lines, margin, y);
        y += lines.length * 6;
      });
    };

    const addFooter = () => {
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150); // Page number

        doc.text(`Page ${i} of ${totalPages}`, margin, pageHeight - 10); // Banner message

        const bannerText =
          "This trip plan was generated through the TrailPlanner website, developed by Alexander Velsmid (https://github.com/alexv26)";
        const bannerY = pageHeight - 5;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(bannerText, margin, bannerY);
      }
    };

    // Generate the PDF
    addHeader();

    addSectionTitle("Trip Overview");
    addText("Trip Leaders", formData.leaders);
    addText(
      "Trip Dates",
      `${convertDate(formData.startDate)} - ${convertDate(formData.endDate)}`
    );
    addText("Number of participants", formData.groupSize);

    addSectionTitle("Route Information");
    addText("Trailhead", formData.trailhead);
    addText("Trailhead Address", formData.trailheadAddress);
    addText("AllTrails Link", formData.allTrailsLink);
    addText("Distance", formData.distanceGain);
    addText("Elevation Gain", formData.elevationGain);
    addText("Estimated Activity Time", formData.activityTime);
    addText("Difficulty", formData.difficulty);
    addText("Trail Map", formData.topoMap);
    addText("Alternative Route", formData.altRoute);
    addText("Backup Exit Points", formData.backupExit);
    addText("Necessary Permits", formData.permits);

    if (formData.startDate !== formData.endDate) {
      addSectionTitle("Overnight Logistics");
      addText("Campsite", formData.campsiteName);
      addText("Campsite Address", formData.campsiteAddress);
      addText("Campsite Price", formData.campsitePrice);
      addText(
        "Campsite Has Bathroom Access",
        formData.campsiteHasBathrooms ? "Yes" : "No"
      );
    }

    addSectionTitle("Scheduling Logistics");
    addText("Departure Time & Place", formData.departure);
    addText("Estimated Return Time", formData.returnTime);
    addText("Meal Breaks", formData.mealBreaks);
    addText("Overnight Plans", formData.overnightPlans);

    addSectionTitle("Meal Plan");
    addText("", formData.mealPlan);

    addSectionTitle("Safety & Emergency Plan");
    addText("Nearest Hospitals", formData.nearestHospital);
    addText("Emergency Contact", formData.emergencyContact);
    addText("Weather Plan", formData.weatherPlan);
    addText("Injury Plan", formData.injuryPlan);
    addText("Late Return Protocol", formData.lateReturn);

    addFooter();

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Display in iframe
    const viewer = document.getElementById("pdfViewer");
    if (viewer) {
      viewer.src = pdfUrl;
    }
  }

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={page === finalPage - 1 ? handleSubmit : handleNext}>
        {page === 1 && (
          <>
            <h2>Create a Trip Plan</h2>
            {showMockButton && (
              <button type="button" onClick={() => setFormData(mockFormData)}>
                Fill with Mock Data
              </button>
            )}
            <label>
              Trip Name:
              <input
                name="tripName"
                value={formData.tripName}
                onChange={handleChange}
                placeholder="e.g. Day Trip to Mt. Lafayette"
                required
              />
            </label>
            <label>
              Trip Leaders:
              <input
                name="leaders"
                value={formData.leaders}
                onChange={handleChange}
                placeholder="e.g. Alex Velsmid and Thomas Gregory"
                required
              />
            </label>
            <div className={styles["date-range"]}>
              <label>
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                End Date:
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </>
        )}

        {page === 2 && (
          <>
            <h2>Group and Logistic Information</h2>
            <label>
              Number of participants:
              <input
                name="groupSize"
                value={formData.groupSize}
                onChange={handleChange}
                placeholder="Group size here"
                required
              />
            </label>
            <label>
              Leader Emergency Contact Info:
              <textarea
                name="emergencyContact"
                rows="2"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder={emergencyContactPlaceholder}
                required
              />
            </label>
            <label>
              Permits or Parking Passes:
              <input
                name="permits"
                value={formData.permits}
                placeholder="Insert either permits required and price or N/A"
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {page == 3 && (
          <>
            <h2>Overnight Logistics</h2>
            <label>
              Campsite Name
              <input
                name="campsiteName"
                value={formData.campsiteName}
                placeholder="Enter campsite name and link"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Campsite Address
              <textarea
                name="campsiteAddress"
                value={formData.campsiteAddress}
                placeholder="Enter address of the campsite, including driving instructions if necessary"
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Campsite Price
              <input
                name="campsitePrice"
                value={formData.campsitePrice}
                placeholder="Enter cost of campsite"
                onChange={handleChange}
                required
              />
            </label>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Campsite has bathroom access
              <input
                style={{ width: "15px", height: "auto" }}
                type="checkbox"
                name="campsiteHasBathrooms"
                checked={formData.campsiteHasBathrooms}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {page == 4 && (
          <>
            <h2>Activity Information</h2>
            <label>
              AllTrails Link:
              <input
                name="allTrailsLink"
                value={formData.allTrailsLink}
                placeholder="e.g. https://www.alltrails.com/trail/us/new-hampshire/mount-lafayette"
                onChange={handleChange}
              />
            </label>
            <label>
              Trailhead Name:
              <input
                name="trailhead"
                value={formData.trailhead}
                placeholder="Insert trailhead name here."
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Trailhead Address
              <textarea
                name="trailheadAddress"
                value={formData.trailheadAddress}
                placeholder="Insert trailhead address here."
                onChange={handleChange}
                required
              />
            </label>
            <p
              style={{
                marginTop: "-10px",
                marginBottom: "5px",
                color: "red",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Warning: address might not always be correct. Please double check
              before submission.
            </p>

            <label>
              Distance (mi):
              <input
                name="distanceGain"
                value={formData.distanceGain}
                placeholder="Insert total trail distance here."
                onChange={handleChange}
              />
            </label>
            <label>
              Elevation Gain (ft):
              <input
                name="elevationGain"
                value={formData.elevationGain}
                placeholder="Insert total trail elevation gain here."
                onChange={handleChange}
              />
            </label>
            <label>
              Estimated Activity Time:
              <input
                name="activityTime"
                value={formData.activityTime}
                onChange={handleChange}
                placeholder="Insert total activity time here."
                required
              />
            </label>
            <label>
              Difficulty:
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={styles["custom-select"]}
              >
                <option value="">Select</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Very Hard">Very Hard</option>
              </select>
            </label>
          </>
        )}

        {page === 5 && (
          <>
            <h2>Timing and Schedule Information</h2>
            <label>
              Departure Time & Place:
              <input
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                placeholder="e.g. 7am from the OA office"
                required
              />
            </label>
            <label>
              Estimated Return Time:
              <input
                name="returnTime"
                value={formData.returnTime}
                onChange={handleChange}
                placeholder="e.g. 5pm"
                required
              />
            </label>
            <label>
              Planned Rest or Meal Breaks:
              <input
                name="mealBreaks"
                value={formData.mealBreaks}
                onChange={handleChange}
                placeholder="e.g. Lunch at the summit, around 12pm"
                required
              />
            </label>
            <label>
              Backup Exit Points:
              <input
                name="backupExit"
                value={formData.backupExit}
                onChange={handleChange}
                placeholder="e.g. Exit off the falling water trail before the ridge, ~1.5 miles from trialhead"
                required
              />
            </label>
          </>
        )}

        {page == 6 && (
          <>
            <h2>Meal Planning</h2>
            <label>
              Meal Plan:
              <textarea
                name="mealPlan"
                rows="15"
                value={formData.mealPlan}
                onChange={handleChange}
                placeholder={mealPlanPlaceholder}
                required
              />
            </label>
            <button type="button" onClick={generateMealPlan}>
              Have AI generate a meal plan
            </button>
            <button
              type="button"
              onClick={() => window.open("/mealplans", "_blank")}
            >
              Explore existing mealplans
            </button>
          </>
        )}

        {page === 7 && (
          <>
            <h2>Contingency and Safety Plans</h2>
            <label>
              Nearest Hospitals:
              <textarea
                name="nearestHospital"
                value={formData.nearestHospital}
                onChange={handleChange}
                placeholder="Please enter the addresses of the nearest hospitals here."
                required
              />
            </label>
            <p
              style={{
                marginTop: "-10px",
                marginBottom: "5px",
                color: "red",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Warning: this list is auto generated. please verify these options
              are valid.
            </p>
            <label>
              Weather Plan:
              <textarea
                name="weatherPlan"
                value={formData.weatherPlan}
                onChange={handleChange}
                placeholder={weatherContingencyPlaceholder}
                required
              />
            </label>
            <label>
              Injury Plan:
              <textarea
                name="injuryPlan"
                value={formData.injuryPlan}
                onChange={handleChange}
                placeholder={injuryContingencyPlaceholder}
                required
              />
            </label>
            <label>
              Late Return Protocol:
              <textarea
                name="lateReturn"
                value={formData.lateReturn}
                placeholder={lateReturnProtocolPlaceholder}
                onChange={handleChange}
              />
            </label>
            <label>
              Alternative Route:
              <textarea
                name="altRoute"
                value={formData.altRoute}
                placeholder={alternativeRoutePlaceholder}
                onChange={handleChange}
              />
            </label>
            <p>
              NOTE: If a contingency should be enacted before departure, a new
              trip plan should be formed.
            </p>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "20px",
              }}
            >
              <b>Publish form to public database?</b>
              <input
                style={{ width: "15px", height: "auto" }}
                type="checkbox"
                name="campsiteHasBathrooms"
                checked={publishForm}
                onChange={handleCheckbox}
              />
            </label>
            <p
              style={{
                color: "blue",
                fontWeight: "bold",
                marginTop: "-10px",
              }}
            >
              Note: names and emergency contact info is removed if you chose to
              share your trip plan.
            </p>
          </>
        )}

        {page === 8 && (
          <>
            <h2>Form Submitted</h2>
            <p>
              Thank you for completing your trip plan! Please see your created
              trip plan below. To download it and view it later, push the
              download button at the top right of the PDF viewer.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <iframe
                id="pdfViewer"
                title="Trip Plan PDF"
                style={{
                  width: "100%",
                  height: "600px",
                  border: "1px solid #ccc",
                  flexGrow: 1,
                }}
              />
            </div>
          </>
        )}

        <div className={styles["form-navigation"]}>
          {page > 1 && page < finalPage + 1 && (
            <button type="button" onClick={handleBack}>
              Back
            </button>
          )}

          {page < finalPage && (
            <button type="button" onClick={handleNext}>
              Next
            </button>
          )}

          {page === finalPage && (
            <button type="submit" onClick={handleSubmit}>
              Submit Plan
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePlan;

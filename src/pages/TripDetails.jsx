import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "./page_styles/TripDetails.module.css";

export default function TripDetails() {
  const location = useLocation();
  const { trip, from } = location.state || {};
  const navigate = useNavigate();

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

  useEffect(() => {
    if (trip) {
      generatePDF(trip);
    }
  }, [trip]);

  return (
    <>
      <div className={styles["navigation"]}>
        <div className={styles["backButton"]}>
          <a href={from}>&lt;-- Go back</a>
        </div>
        <div className={styles["copyPlanButton"]}>
          <button onClick={handleCopyPlan} disabled={!trip}>
            Copy Plan
          </button>
        </div>
      </div>
      <div className={styles["pdfViewer"]}>
        <iframe
          id="pdfViewer"
          title="Trip Plan PDF"
          className={styles["iframePDF"]}
        />
      </div>
    </>
  );
}

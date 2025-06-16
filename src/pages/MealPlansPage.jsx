import { useState, useEffect } from "react";
import styles from "./page_styles/MealPlansPage.module.css";

export default function MealPlans() {
  const [page, setPage] = useState(1);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3004/mealplans")
      .then((res) => res.json())
      .then((data) => {
        setMealPlans(data); // Expecting an array of meal plan strings
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load meal plans:", err);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (page < mealPlans.length) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <>
      <div className={styles["flex-wrapper"]}>
        <div className={styles["container"]}>
          <h1>Meal Plans</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <textarea
                placeholder="Meal Plans Here"
                rows={10}
                value={mealPlans[page - 1] || ""}
                readOnly
              />
              <div className={styles["pagination"]}>
                {/* Always show page 1 */}
                <button
                  className={`${styles["page-button"]} ${
                    page === 1 ? styles["active"] : ""
                  }`}
                  onClick={() => setPage(1)}
                >
                  1
                </button>

                {/* Show "..." if there's a gap between 1 and the first nearby page */}
                {page > 4 && <span className={styles["ellipsis"]}>...</span>}

                {/* Show pages around the current page */}
                {mealPlans.map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrent = page === pageNum;
                  const isNearCurrent = Math.abs(page - pageNum) <= 2;

                  if (
                    pageNum !== 1 &&
                    pageNum !== mealPlans.length &&
                    isNearCurrent
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`${styles["page-button"]} ${
                          isCurrent ? styles["active"] : ""
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }

                  return null;
                })}

                {/* Show "..." if there's a gap before the last page */}
                {page < mealPlans.length - 3 && (
                  <span className={styles["ellipsis"]}>...</span>
                )}

                {/* Always show last page if it's not page 1 */}
                {mealPlans.length > 1 && (
                  <button
                    className={`${styles["page-button"]} ${
                      page === mealPlans.length ? styles["active"] : ""
                    }`}
                    onClick={() => setPage(mealPlans.length)}
                  >
                    {mealPlans.length}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

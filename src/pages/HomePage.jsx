import styles from "./page_styles/HomePage.module.css";

function HomePage() {
  return (
    <>
      <div className={styles["hero"]}>
        <div className={styles["hero-text"]}>
          <h1>TrailPlanner</h1>
          <p>Plan, explore, and log your outdoor adventures</p>
          <a className={styles["create-plan-button"]} href="/plan">
            Begin creating adventure plan
          </a>
        </div>
      </div>
    </>
  );
}

export default HomePage;

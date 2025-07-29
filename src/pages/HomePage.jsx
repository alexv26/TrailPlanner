import styles from "./page_styles/HomePage.module.css";
const publicUrl = import.meta.env.BASE_URL;

function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.hero}>
          <video
            src={`${publicUrl}assets/video-bkgnd.mov`}
            muted
            autoPlay
            loop
          />
          <div className={styles.content}>
            <div className={styles["hero-text"]}>
              <h1>TrailPlanner</h1>
              <p>Plan, explore, and log your outdoor adventures</p>
            </div>
            <a className={styles["create-plan-button"]} href="./#/plan">
              Begin creating adventure plan
            </a>
          </div>
        </div>
        <div className={styles.explore}></div>
      </div>
    </>
  );
}

export default HomePage;

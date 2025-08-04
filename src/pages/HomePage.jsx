import styles from "./page_styles/HomePage.module.css";
const publicUrl = import.meta.env.BASE_URL;
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function HomePage() {
  const navigate = useNavigate();
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
            <motion.button
              whileHover={{
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.985,
              }}
              onClick={() => navigate("/plan")}
              className={styles.animButton}
            >
              Learn More <FiArrowRight className={styles.animArrow} />
            </motion.button>
          </div>
        </div>
        <div className={styles.explore}></div>
      </div>
    </>
  );
}

export default HomePage;

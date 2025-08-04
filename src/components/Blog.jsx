import styles from "./component_styles/Blog.module.css";
import { motion, MotionConfig } from "motion/react";

export default function Blog({ imgLink, title, bodyText, directTo }) {
  return (
    <MotionConfig whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
      <div className={styles.tile}>
        <img src={imgLink} alt={title} />
        <div className={styles.text}>
          <div className={styles.content}>
            <motion.a className={styles.link} href={directTo}>
              <h3>{title}</h3>
            </motion.a>
            <p>{bodyText}</p>
          </div>
          <motion.a
            whileHover={{ color: "#007bff" }}
            className={styles.readMore}
            href={directTo}
          >
            READ MORE
          </motion.a>
        </div>
      </div>
    </MotionConfig>
  );
}

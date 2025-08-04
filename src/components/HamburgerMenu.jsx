import React from "react";
import { MotionConfig, motion } from "motion/react";
import styles from "./component_styles/HamburgerMenu.module.css";

export default function HamburgerMenu({ state, setState }) {
  return (
    <div className={styles.wrapper}>
      <MotionConfig
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <motion.button
          initial={false}
          animate={state ? "open" : "closed"}
          onClick={() => {
            setState((pv) => !pv);
          }}
          className={styles.hamburgerButton}
        >
          <motion.span
            variants={VARIANTS.top}
            className={styles.topBar}
            style={{ y: "-50%", left: "50%", x: "-50%", top: "35%" }}
          />
          <motion.span
            variants={VARIANTS.middle}
            className={styles.midBar}
            style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
          />
          <motion.span
            variants={VARIANTS.bottom}
            className={styles.bottomBar}
            style={{
              x: "-50%",
              y: "50%",
              bottom: "35%",
              left: "calc(50% + 10px)",
            }}
          />
        </motion.button>
      </MotionConfig>
    </div>
  );
}

const VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};

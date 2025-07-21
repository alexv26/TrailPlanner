import styles from "./page_styles/About.module.css";
import canyon from "../assets/canyon.jpg";
import alex from "../assets/alex.jpg";

function AboutTile({ imgSrc, header, body, imgSide }) {
  const tileClass =
    imgSide === "right"
      ? `${styles.aboutTile} ${styles.reverse}`
      : styles.aboutTile;

  return (
    <div className={tileClass}>
      <div className={styles.aboutTileImg}>
        <img src={imgSrc} />
      </div>
      <div className={styles.aboutTileText}>
        <h1>{header}</h1>
        <p>{body}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className={styles.container}>
      <AboutTile
        imgSrc={canyon}
        header="About This Site"
        body={`Planning for hikes has never been made easier. With TrailPlanner, you no longer have to feel unprepared for whatever adventures you partake in. TrailPlanner is a tool designed to make organizing outdoor trips easier, safer, and more collaborative. Whether you're a seasoned trip leader or planning your first hike, this site helps you create comprehensive trip plans by filling out a simple form — no more starting from scratch every time. TrailPlanner aims to remove the burden of completing repetitive tasks in trip planning, such as meal planning, locating nearest hospitals, parking lots, and more, through the assistance of various APIs and artificial intelligence. \n In addition to planning, TrailPlanner includes a trip history feature. You can browse past trip records by location, letting you learn from previous groups — what to expect on the trail, what worked well, and what could be improved. It's all about building a smarter, safer outdoor community.`}
        imgSide="left"
      />
      <AboutTile
        imgSrc={alex}
        header="About The Creator"
        body="This project was created by Alexander Velsmid, a student and outdoor enthusiast who has led and organized outdoor trips through Outdoor Adventures at Boston College for three years. After recognizing how repetitive and inconsistent trip planning could be — especially on informal or non-organization-led outings — Alex built TrailPlanner to simplify the process and make it easier for leaders to create thorough, reusable plans while sharing insights across trips and teams."
        imgSide="right"
      />
      <AboutTile
        imgSrc={
          "https://www.thenaturaladventure.com/wp-content/uploads/2024/06/hiking-safety-tips-for-mountain-landscapes-2-1024x547.png"
        }
        header="Why it Matters"
        body="Outdoor leadership isn't just about the hike — it's about preparation. This platform encourages better planning habits, promotes safety, and builds a record of shared experience that grows over time. It's like a digital trail log for the next generation of trip leaders."
        imgSide="left"
      />
    </div>
  );
}
/* 
 <>
      <div className={styles["about"]}>
        <div className={styles["section1"]}>
          <div className={styles["text"]}>
            <h2>About the site</h2>
            <p>
              Planning for hikes has never been made easier. With TrailPlanner,
              you no longer have to feel unprepared for whatever adventures you
              partake in. TrailPlanner is a tool designed to make organizing
              outdoor trips easier, safer, and more collaborative. Whether
              you're a seasoned trip leader or planning your first hike, this
              site helps you create comprehensive trip plans by filling out a
              simple form — no more starting from scratch every time.
            </p>
            <p>
              TrailPlanner aims to remove the burden of completing repetitive
              tasks in trip planning, such as meal planning, locating nearest
              hospitals, parking lots, and more, through the assistance of
              various APIs and artificial intelligence.
            </p>
            <p>
              In addition to planning, TrailPlanner includes a trip history
              feature. You can browse past trip records by location, letting you
              learn from previous groups — what to expect on the trail, what
              worked well, and what could be improved. It's all about building a
              smarter, safer outdoor community.
            </p>
          </div>
          <div className={styles["img-container"]}>
            <img src={canyon} />
          </div>
        </div>
        <div className={styles["section2"]}>
          <div className={styles["img-container"]}>
            <img src={alex} />
          </div>
          <div className={styles["text"]}>
            <h2>About the creator</h2>
            <p>
              This project was created by Alexander Velsmid, a student and
              outdoor enthusiast who has led and organized outdoor trips through
              Outdoor Adventures at Boston College for three years. After
              recognizing how repetitive and inconsistent trip planning could be
              — especially on informal or non-organization-led outings — Alex
              built TrailPlanner to simplify the process and make it easier for
              leaders to create thorough, reusable plans while sharing insights
              across trips and teams.
            </p>
          </div>
        </div>
        <div className={styles["section1"]}>
          <div className={styles["text"]}>
            <h2>Why it matters</h2>
            <p>
              Outdoor leadership isn't just about the hike — it's about
              preparation. This platform encourages better planning habits,
              promotes safety, and builds a record of shared experience that
              grows over time. It's like a digital trail log for the next
              generation of trip leaders.
            </p>
          </div>
          <div className={styles["img-container"]}>
            <img src="https://www.thenaturaladventure.com/wp-content/uploads/2024/06/hiking-safety-tips-for-mountain-landscapes-2-1024x547.png" />
          </div>
        </div>
      </div>
    </>

    
.about {
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

.section1 {
  display: flex;
  margin-top: -7px;
  width: 100%;
  border-radius: 5px;
}

img {
  border-radius: 5px;
}

.img-container {
  width: 51.5%;
  height: 700px; 
  overflow: hidden;
  margin-top: 5px;
}

.section1 .img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: 50% 30%;
  border-radius: 0px;
}

.text {
  width: 50%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: top;
  text-align: justify;
  text-justify: auto;
  font-size: 22px;
}

.section2 {
  display: flex;
  margin-top: -5px;
  width: 100%;
}

.section2 .img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: 50% 80%;
  border-radius: 0px;
}
    */

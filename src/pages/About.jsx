import "./page_styles/About.css";

export default function About() {
  return (
    <>
      <div className="wrapper">
        <div className="content">
          <h1>About</h1>
          <div className="about-the-site">
            <h2>🏞️ About This Site</h2>
            <p>
              TrailPlanner is a tool designed to make organizing outdoor trips
              easier, safer, and more collaborative. Whether you're a seasoned
              trip leader or planning your first hike, this site helps you
              create comprehensive trip plans by filling out a simple form — no
              more starting from scratch every time.
            </p>
            <p>
              Once you've entered basic trip details like destination, dates,
              and leaders, the platform generates a clear, organized plan you
              can share with your group. Each plan includes logistics, links,
              and important safety info.
            </p>
            <p>
              In addition to planning, TrailPlanner includes a trip history
              feature. You can browse past trip records by location, letting you
              learn from previous groups — what to expect on the trail, what
              worked well, and what could be improved. It’s all about building a
              smarter, safer outdoor community.
            </p>
          </div>
          <div className="about-the-creator">
            <h2>👨‍💻 About the Creator</h2>
            <div className="about-the-creator-flex-wrapper">
              <img src="https://www.bc.edu/content/bc-web/offices/rec/outdoor-adventures/Current-Trip-Leaders/Alex-Velsmid/_jcr_content/profileImage.img.jpg/1740163378628.jpg" />
              <p>
                This project was created by Alexander Velsmid, a student and
                outdoor enthusiast who has led trips through Outdoor Adventures
                at Boston College for three years. After recognizing how
                repetitive and inconsistent trip planning could be — especially
                on informal or non-organization-led outings — Alex built
                TrailPlanner to simplify the process and make it easier for
                leaders to create thorough, reusable plans while sharing
                insights across trips and teams.
              </p>
            </div>
          </div>
          <div className="why-this-matters">
            <h2>🌐 Why It Matters</h2>
            <p>
              Outdoor leadership isn’t just about the hike — it’s about
              preparation. This platform encourages better planning habits,
              promotes safety, and builds a record of shared experience that
              grows over time. It's like a digital trail log for the next
              generation of trip leaders.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

import "./page_styles/HomePage.css";

function HomePage() {
  return (
    <>
      <div className="hero">
        <div className="hero-text">
          <h1>TrailPlanner</h1>
          <p>Plan, explore, and log your outdoor adventures</p>
          <a id="create-plan-button" href="/plan">
            Begin creating adventure plan
          </a>
        </div>
      </div>
    </>
  );
}

export default HomePage;

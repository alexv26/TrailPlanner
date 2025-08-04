import { useEffect, useState } from "react";
import styles from "./page_styles/Resources.module.css";
import Blog from "../components/Blog";
import { useAuth } from "../components//AuthProvider";
import { useNavigate } from "react-router-dom";

// Fetches resources from MongoDB

export default function Resources() {
  const [resources, setResources] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resources`)
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error("Failed to load resources:", err));
  }, []);

  return (
    <>
      <div className={styles.container}>
        {user && (user.role == "Admin" || user.role == "Editor") && (
          <div className={styles.buttonWrapper}>
            <button
              className={styles.createResourceButton}
              onClick={() => {
                navigate("/createblog");
              }}
            >
              + Create Blog
            </button>
          </div>
        )}
        <div className={styles.tiles}>
          {resources.map((resource, index) => (
            <Blog
              key={index}
              title={resource.title}
              bodyText={resource.shortDescription}
              imgLink={resource.imgLink}
              directTo={resource.directTo}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/*
<ResourceLinkTile
          key={index}
          title={resource.title}
          bodyText={resource.bodyText}
          imgLink={resource.imgLink}
          directTo={resource.directTo}
        />
        */

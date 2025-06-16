import { useEffect, useState } from "react";
import styles from "./page_styles/Resources.module.css";
import ResourceLinkTile from "../components/ResourceLinkTile";

// Fetches resources from MongoDB

export default function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3004/resources")
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error("Failed to load resources:", err));
  }, []);

  return (
    <>
      {resources.map((resource, index) => (
        <ResourceLinkTile
          key={index}
          title={resource.title}
          bodyText={resource.bodyText}
          imgLink={resource.imgLink}
          directTo={resource.directTo}
        />
      ))}
    </>
  );
}

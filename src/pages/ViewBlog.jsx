import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./page_styles/ViewBlog.module.css";

export default function ViewBlog() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  console.log("Viewing blog with id:", blogId);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resources/${blogId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blog");
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [blogId]);

  if (!blog) return <div className={styles.container}>Loading...</div>; //! Change to loading spinner later

  console.log("Fetched blog data:", blog);

  function formatDateWithOrdinal(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();

    // Get ordinal suffix
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    const options = { month: "long", year: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);
    return `${formatted.split(" ")[0]} ${day}${getOrdinal(day)} ${
      formatted.split(" ")[1]
    }`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.blogTitle}>{blog.title}</h1>
        <p>
          <p>
            <i>{formatDateWithOrdinal(blog.date)}</i>
          </p>
        </p>
      </div>

      <div
        className={styles.bodyText}
        dangerouslySetInnerHTML={{ __html: blog.bodyText }}
      />
    </div>
  );
}

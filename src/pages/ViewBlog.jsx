import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import styles from "./page_styles/ViewBlog.module.css";

export default function ViewBlog() {
  const { blogId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

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
          <i>{formatDateWithOrdinal(blog.date)}</i>
        </p>
      </div>

      <div
        className={styles.bodyText}
        dangerouslySetInnerHTML={{ __html: blog.bodyText }}
      />
      {user && (user.role === "Admin" || user.role === "Editor") && (
        <div className={styles.deleteButtonWrapper}>
          <button
            className={styles.deleteButton}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this blog?")
              ) {
                fetch(
                  `${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/resources/${blogId}`,
                  {
                    method: "DELETE",
                  }
                )
                  .then((res) => {
                    if (!res.ok) throw new Error("Failed to delete blog");
                    navigate("/resources");
                  })
                  .catch((err) => console.error("Error deleting blog:", err));
              }
            }}
          >
            Delete Blog
          </button>
        </div>
      )}
    </div>
  );
}

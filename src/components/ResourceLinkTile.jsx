import styles from "./component_styles/ResourceLinkTile.module.css";

export default function ResourceLinkTile({
  imgLink,
  title,
  bodyText,
  directTo,
}) {
  return (
    <>
      <a href={directTo}>
        <div className={styles["container"]}>
          <div className={styles["tile"]}>
            <div className={styles["image"]}>
              <img src={imgLink} />
            </div>
            <div className={styles["text"]}>
              <h1>{title}</h1>
              <p>{bodyText}</p>
            </div>
          </div>
        </div>
      </a>
    </>
  );
}

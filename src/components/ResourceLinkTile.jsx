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
        <div className={styles.tile}>
          <img src={imgLink} />
          <h3>{title}</h3>
          <p>{bodyText}</p>
        </div>
      </a>
    </>
  );
}

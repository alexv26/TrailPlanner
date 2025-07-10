import styles from "./page_styles/Admin.module.css";

export default function Admin() {
  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.bin}>
          <h1>Manage Users</h1>
        </div>
        <div className={styles.bin}>
          <h1>Bin 2</h1>
        </div>
        <div className={styles.bin}>
          <h1>Bin 3</h1>
        </div>
      </div>
    </>
  );
}

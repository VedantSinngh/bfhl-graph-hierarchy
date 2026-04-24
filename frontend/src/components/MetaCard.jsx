import styles from './MetaCard.module.css';

export default function MetaCard({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.item}>
        <label>User ID</label>
        <span>{data.user_id}</span>
      </div>
      <div className={styles.item}>
        <label>Email</label>
        <span>{data.email_id}</span>
      </div>
      <div className={styles.item}>
        <label>Roll No.</label>
        <span>{data.college_roll_number}</span>
      </div>
    </div>
  );
}

import styles from './SummaryStrip.module.css';

export default function SummaryStrip({ summary }) {
  return (
    <div className={styles.strip}>
      <div className={`${styles.tile} ${styles.treeTile}`}>
        <div className={styles.value}>{summary.total_trees}</div>
        <div className={styles.label}>Trees Found</div>
      </div>
      <div className={`${styles.tile} ${styles.cycleTile}`}>
        <div className={styles.value}>{summary.total_cycles}</div>
        <div className={styles.label}>Cycles Found</div>
      </div>
      <div className={`${styles.tile} ${styles.rootTile}`}>
        <div className={styles.value}>{summary.largest_tree_root || '—'}</div>
        <div className={styles.label}>Largest Tree Root</div>
      </div>
    </div>
  );
}

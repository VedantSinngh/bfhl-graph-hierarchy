import styles from './ValidationSection.module.css';

export default function ValidationSection({ invalidEntries, duplicateEdges }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <div className={styles.title}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
          </svg>
          Invalid Entries
          <span className={styles.count}>{(invalidEntries || []).length}</span>
        </div>
        <div className={styles.tags}>
          {invalidEntries && invalidEntries.length > 0 ? (
            invalidEntries.map((e, i) => (
              <span key={i} className={`${styles.tag} ${styles.tagInvalid}`}>
                {e || '(empty)'}
              </span>
            ))
          ) : (
            <span className={styles.empty}>None</span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.title}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          </svg>
          Duplicate Edges
          <span className={styles.count}>{(duplicateEdges || []).length}</span>
        </div>
        <div className={styles.tags}>
          {duplicateEdges && duplicateEdges.length > 0 ? (
            duplicateEdges.map((e, i) => (
              <span key={i} className={`${styles.tag} ${styles.tagDuplicate}`}>{e}</span>
            ))
          ) : (
            <span className={styles.empty}>None</span>
          )}
        </div>
      </div>
    </div>
  );
}

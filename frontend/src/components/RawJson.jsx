import { useState } from 'react';
import styles from './RawJson.module.css';

export default function RawJson({ data }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrapper}>
      <button className={`${styles.toggle} ${open ? styles.open : ''}`} onClick={() => setOpen(!open)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        Raw JSON Response
        <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className={styles.body}>
          <pre className={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

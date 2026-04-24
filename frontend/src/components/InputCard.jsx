import styles from './InputCard.module.css';

export default function InputCard({ value, onChange, onSubmit, onClear, onExample, loading }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSubmit();
  }

  return (
    <div className={styles.card}>
      <label className={styles.label} htmlFor="edgeInput">Edge List</label>
      <textarea
        id="edgeInput"
        className={styles.textarea}
        placeholder={'A->B, A->C, B->D\nor one per line:\nA->B\nB->C'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
      <div className={styles.hint}>
        Separate entries with commas or newlines. Format: <code>X-&gt;Y</code> where X, Y ∈ A–Z.
      </div>
      <div className={styles.btnRow}>
        <button className={styles.btnSubmit} onClick={onSubmit} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Analyse
            </>
          )}
        </button>
        <button className={styles.btnClear} onClick={onClear}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
          Clear
        </button>
        <button className={styles.btnExample} onClick={onExample}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Load example
        </button>
      </div>
    </div>
  );
}

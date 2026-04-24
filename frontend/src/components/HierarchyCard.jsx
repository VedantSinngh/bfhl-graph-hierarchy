import TreeVisualizer from './TreeVisualizer';
import styles from './HierarchyCard.module.css';

export default function HierarchyCard({ hierarchy }) {
  const isCycle = hierarchy.has_cycle;
  return (
    <div className={`${styles.card} ${isCycle ? styles.cycleCard : styles.treeCard}`}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${isCycle ? styles.badgeCycle : styles.badgeTree}`}>
          {isCycle ? '⟳ Cycle' : '🌳 Tree'}
        </span>
        <span className={styles.root}>
          Root: <strong>{hierarchy.root}</strong>
        </span>
        {!isCycle && (
          <span className={styles.depth}>depth {hierarchy.depth}</span>
        )}
      </div>
      <div className={styles.body}>
        {isCycle ? (
          <div className={styles.cyclePlaceholder}>
            <span style={{ color: '#ef4444', fontWeight: '500' }}>⚠️ Cycle Detected</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Tree rendering disabled due to closed loop</span>
          </div>
        ) : (
          <TreeVisualizer tree={hierarchy.tree} />
        )}
      </div>
    </div>
  );
}

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
            <span className={styles.cycleIcon}>⟳</span>
            <span>Cyclic group — no acyclic tree structure</span>
            <span className={styles.cycleRoot}>
              Root (lex. smallest): <strong>{hierarchy.root}</strong>
            </span>
          </div>
        ) : (
          <TreeVisualizer tree={hierarchy.tree} />
        )}
      </div>
    </div>
  );
}

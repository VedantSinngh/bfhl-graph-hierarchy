import HierarchyCard from './HierarchyCard';
import styles from './HierarchiesSection.module.css';

export default function HierarchiesSection({ hierarchies }) {
  if (!hierarchies || hierarchies.length === 0) {
    return <p className={styles.empty}>No hierarchies found.</p>;
  }
  return (
    <div className={styles.grid}>
      {hierarchies.map((h, i) => (
        <HierarchyCard key={i} hierarchy={h} />
      ))}
    </div>
  );
}

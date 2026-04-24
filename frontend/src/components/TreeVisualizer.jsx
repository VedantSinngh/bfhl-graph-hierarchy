import styles from './TreeVisualizer.module.css';

function TreeNode({ name, children, prefix, isLast }) {
  const connector = prefix + (isLast ? '└── ' : '├── ');
  const childPrefix = prefix + (isLast ? '    ' : '│   ');
  const keys = Object.keys(children);
  return (
    <div>
      <div className={styles.nodeRow}>
        <span className={styles.connector}>{connector}</span>
        <span className={styles.nodeName}>{name}</span>
      </div>
      {keys.map((child, idx) => (
        <TreeNode
          key={child}
          name={child}
          children={children[child]}
          prefix={childPrefix}
          isLast={idx === keys.length - 1}
        />
      ))}
    </div>
  );
}

export default function TreeVisualizer({ tree }) {
  const roots = Object.keys(tree);
  return (
    <div className={styles.tree}>
      {roots.map(root => {
        const children = tree[root];
        const keys = Object.keys(children);
        return (
          <div key={root}>
            <div className={styles.nodeRow}>
              <span className={`${styles.nodeName} ${styles.rootNode}`}>{root}</span>
            </div>
            {keys.map((child, idx) => (
              <TreeNode
                key={child}
                name={child}
                children={children[child]}
                prefix=""
                isLast={idx === keys.length - 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

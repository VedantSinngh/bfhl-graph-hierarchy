const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function isValidEdge(entry) {
  return /^[A-Z]->[A-Z]$/.test(entry.trim());
}

function processData(rawData) {
  const validEdges = [];
  const invalidEntries = [];

  for (const entry of rawData) {
    const trimmed = entry.trim();
    if (isValidEdge(trimmed)) {
      validEdges.push(trimmed);
    } else {
      invalidEntries.push(entry);
    }
  }

  const seenEdges = new Set();
  const duplicateEdges = [];
  const uniqueEdges = [];

  for (const edge of validEdges) {
    if (seenEdges.has(edge)) {
      if (!duplicateEdges.includes(edge)) {
        duplicateEdges.push(edge);
      }
    } else {
      seenEdges.add(edge);
      uniqueEdges.push(edge);
    }
  }

  const adjacency = {};
  const parentOf = {};
  const allNodes = new Set();

  for (const edge of uniqueEdges) {
    const [parent, child] = edge.split('->');
    allNodes.add(parent);
    allNodes.add(child);
    if (!adjacency[parent]) adjacency[parent] = [];
    if (!adjacency[child]) adjacency[child] = [];
    if (parentOf[child] !== undefined) continue;
    adjacency[parent].push(child);
    parentOf[child] = parent;
  }

  const visited = new Set();
  const components = [];

  function collectComponent(start) {
    const component = new Set();
    const stack = [start];
    while (stack.length) {
      const node = stack.pop();
      if (visited.has(node)) continue;
      visited.add(node);
      component.add(node);
      if (adjacency[node]) {
        for (const child of adjacency[node]) {
          if (!visited.has(child)) stack.push(child);
        }
      }
      for (const n of allNodes) {
        if (!visited.has(n) && adjacency[n] && adjacency[n].includes(node)) {
          stack.push(n);
        }
      }
    }
    return component;
  }

  for (const node of Array.from(allNodes).sort()) {
    if (!visited.has(node)) {
      components.push(collectComponent(node));
    }
  }

  function hasCycle(component) {
    const color = {};
    for (const n of component) color[n] = 0;
    function dfs(node) {
      color[node] = 1;
      for (const child of (adjacency[node] || [])) {
        if (!component.has(child)) continue;
        if (color[child] === 1) return true;
        if (color[child] === 0 && dfs(child)) return true;
      }
      color[node] = 2;
      return false;
    }
    for (const n of component) {
      if (color[n] === 0 && dfs(n)) return true;
    }
    return false;
  }

  function buildTree(node, component) {
    const obj = {};
    for (const child of (adjacency[node] || [])) {
      if (component.has(child)) {
        obj[child] = buildTree(child, component);
      }
    }
    return obj;
  }

  function computeDepth(node, component) {
    const children = (adjacency[node] || []).filter(c => component.has(c));
    if (children.length === 0) return 1;
    return 1 + Math.max(...children.map(c => computeDepth(c, component)));
  }

  const hierarchies = [];

  for (const component of components) {
    const cyclic = hasCycle(component);
    if (cyclic) {
      const sorted = Array.from(component).sort();
      const roots = sorted.filter(n => parentOf[n] === undefined);
      const root = roots.length > 0 ? roots[0] : sorted[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const roots = Array.from(component).filter(n => parentOf[n] === undefined).sort();
      for (const root of roots) {
        hierarchies.push({
          root,
          tree: { [root]: buildTree(root, component) },
          depth: computeDepth(root, component),
        });
      }
    }
  }

  const nonCyclicTrees = hierarchies.filter(h => !h.has_cycle);
  const cyclicGroups = hierarchies.filter(h => h.has_cycle);

  let largestTreeRoot = '';
  if (nonCyclicTrees.length > 0) {
    nonCyclicTrees.sort((a, b) => {
      if (b.depth !== a.depth) return b.depth - a.depth;
      return a.root.localeCompare(b.root);
    });
    largestTreeRoot = nonCyclicTrees[0].root;
  }

  return {
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: nonCyclicTrees.length,
      total_cycles: cyclicGroups.length,
      largest_tree_root: largestTreeRoot,
    },
  };
}

app.get('/bfhl', (_req, res) => {
  res.json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: '"data" must be an array of strings.' });
    }
    const result = processData(data.map(String));
    return res.status(200).json({
      user_id: 'vedant_singh_21042005',
      email_id: 'vs9239@srmist.edu.in',
      college_roll_number: 'RA2311026010436',
      ...result,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`BFHL API running on http://localhost:${PORT}`);
  });
}

module.exports = app;

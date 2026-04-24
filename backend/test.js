/**
 * Quick self-test — run with:  node test.js
 * Verifies the processing logic against the spec example.
 */

// Pull in the exact same logic from server.js inline (no HTTP needed)
function isValidEdge(entry) {
  return /^[A-Z]->[A-Z]$/.test(entry.trim());
}

function processData(rawData) {
  // Step 1 – Validate
  const validEdges = [], invalidEntries = [];
  for (const entry of rawData) {
    (isValidEdge(entry.trim()) ? validEdges : invalidEntries).push(entry);
  }

  // Step 2 – Deduplicate
  const seenEdges = new Set(), duplicateEdges = [], uniqueEdges = [];
  for (const edge of validEdges) {
    if (seenEdges.has(edge)) { if (!duplicateEdges.includes(edge)) duplicateEdges.push(edge); }
    else { seenEdges.add(edge); uniqueEdges.push(edge); }
  }

  // Step 3 – Adjacency + parentOf
  const adjacency = {}, parentOf = {}, allNodes = new Set();
  for (const edge of uniqueEdges) {
    const [parent, child] = edge.split('->');
    allNodes.add(parent); allNodes.add(child);
    if (!adjacency[parent]) adjacency[parent] = [];
    if (!adjacency[child])  adjacency[child]  = [];
    if (parentOf[child] !== undefined) continue;
    adjacency[parent].push(child);
    parentOf[child] = parent;
  }

  // Step 3b – Components
  const visited = new Set(), components = [];
  function collectComponent(start) {
    const component = new Set(), stack = [start];
    while (stack.length) {
      const node = stack.pop();
      if (visited.has(node)) continue;
      visited.add(node); component.add(node);
      if (adjacency[node]) for (const c of adjacency[node]) if (!visited.has(c)) stack.push(c);
      for (const n of allNodes) if (!visited.has(n) && adjacency[n] && adjacency[n].includes(node)) stack.push(n);
    }
    return component;
  }
  for (const node of Array.from(allNodes).sort()) if (!visited.has(node)) components.push(collectComponent(node));

  // Step 4/5 – Cycle detection + tree build
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
      color[node] = 2; return false;
    }
    for (const n of component) if (color[n] === 0 && dfs(n)) return true;
    return false;
  }
  function buildTree(node, component) {
    const obj = {};
    for (const child of (adjacency[node] || [])) if (component.has(child)) obj[child] = buildTree(child, component);
    return obj;
  }
  function computeDepth(node, component) {
    const children = (adjacency[node] || []).filter(c => component.has(c));
    return children.length === 0 ? 1 : 1 + Math.max(...children.map(c => computeDepth(c, component)));
  }

  const hierarchies = [];
  for (const component of components) {
    const cyclic = hasCycle(component);
    if (cyclic) {
      const sorted = Array.from(component).sort();
      const roots  = sorted.filter(n => parentOf[n] === undefined);
      const root   = roots.length > 0 ? roots[0] : sorted[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const roots = Array.from(component).filter(n => parentOf[n] === undefined).sort();
      for (const root of roots) {
        hierarchies.push({ root, tree: { [root]: buildTree(root, component) }, depth: computeDepth(root, component) });
      }
    }
  }

  // Step 7 – Summary
  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const cyclic    = hierarchies.filter(h =>  h.has_cycle);
  nonCyclic.sort((a,b) => b.depth - a.depth || a.root.localeCompare(b.root));
  return {
    hierarchies,
    invalid_entries : invalidEntries,
    duplicate_edges : duplicateEdges,
    summary: { total_trees: nonCyclic.length, total_cycles: cyclic.length, largest_tree_root: nonCyclic[0]?.root || '' }
  };
}

// ── Run test ──────────────────────────────────────────────────────────────────
const input = ["A->B","A->C","B->D","C->E","E->F","X->Y","Y->Z","Z->X","P->Q","Q->R","G->H","G->H","G->I","hello","1->2","A->"];
const result = processData(input);

console.log('\n=== RESULT ===');
console.log(JSON.stringify(result, null, 2));

// ── Assertions ────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
function assert(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  if (!ok) { console.log('   Expected:', JSON.stringify(expected)); console.log('   Got:     ', JSON.stringify(actual)); }
  ok ? pass++ : fail++;
}

const h = result.hierarchies;
assert('4 hierarchy groups',      h.length, 4);
assert('H[0] root = A',           h[0].root, 'A');
assert('H[0] depth = 4',          h[0].depth, 4);
assert('H[0] tree structure',     h[0].tree, { A: { B: { D: {} }, C: { E: { F: {} } } } });
assert('H[1] has_cycle = true',   h[1].has_cycle, true);
assert('H[1] root = X',           h[1].root, 'X');
assert('H[2] root = P',           h[2].root, 'P');
assert('H[2] depth = 3',          h[2].depth, 3);
assert('H[3] root = G',           h[3].root, 'G');
assert('H[3] depth = 2',          h[3].depth, 2);
assert('invalid_entries',         result.invalid_entries, ['hello','1->2','A->']);
assert('duplicate_edges',         result.duplicate_edges, ['G->H']);
assert('summary.total_trees',     result.summary.total_trees, 3);
assert('summary.total_cycles',    result.summary.total_cycles, 1);
assert('summary.largest_tree_root', result.summary.largest_tree_root, 'A');

console.log(`\n${pass} passed / ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);

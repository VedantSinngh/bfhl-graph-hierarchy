import { useState } from 'react';
import './index.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/bfhl`;

function parseInput(raw) {
  return raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
}

function AsciiTree({ tree }) {
  const renderNodes = (nodes, prefix = '') => {
    const keys = Object.keys(nodes);
    return keys.map((key, i) => {
      const isLast = i === keys.length - 1;
      const connector = prefix + (isLast ? '└── ' : '├── ');
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      
      return (
        <div key={prefix + key}>
          <span className="connector">{connector}</span>
          <span className="node">{key}</span>
          {renderNodes(nodes[key], childPrefix)}
        </div>
      );
    });
  };

  const roots = Object.keys(tree);
  return (
    <div className="hier-ascii">
      {roots.map(root => (
        <div key={root}>
          <span className="node">{root}</span>
          {renderNodes(tree[root], '')}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Status line count
  const charCount = input.length;
  const nodeCount = parseInput(input).length;

  const handleAnalyze = async () => {
    setError(null);
    const dataArr = parseInput(input);
    if (!dataArr.length) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataArr })
      });
      if (!res.ok) throw new Error('failed to fetch');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(`// api error: ${err.message.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      {/* Left Input Panel */}
      <div className="left-panel">
        <div className="input-label">NODE INPUT</div>
        <textarea
          spellCheck={false}
          placeholder="A->B, A->C, B->D, X->Y ..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="status-line">{charCount} chars | {nodeCount} nodes</div>
        
        <button 
          className="analyze-btn" 
          onClick={handleAnalyze} 
          disabled={loading}
        >
          {loading ? (
            <>ANALYZING... <span className="blinking-cursor">_</span></>
          ) : (
            'ANALYZE'
          )}
        </button>

        {error && <div className="error-bar">{error}</div>}
      </div>

      {/* Right Output Panel */}
      <div className="right-panel">
        {!data && !loading && <div className="waiting">// waiting for input</div>}
        
        {data && (
          <div className="results">
            
            <div className="results-section">
              <div className="section-title">IDENTITY</div>
              <div className="kv-line"><span className="kv-key">user_id:</span><span className="kv-val">{data.user_id}</span></div>
              <div className="kv-line"><span className="kv-key">email_id:</span><span className="kv-val">{data.email_id}</span></div>
              <div className="kv-line"><span className="kv-key">college_roll_number:</span><span className="kv-val">{data.college_roll_number}</span></div>
            </div>

            {data.summary && (
              <div className="results-section">
                <div className="section-title">SUMMARY</div>
                <div className="summary-grid">
                  <div className="summary-box">
                    <span className="summary-val">{data.summary.total_trees}</span>
                    <span className="summary-lbl">TREES</span>
                  </div>
                  <div className="summary-box">
                    <span className="summary-val">{data.summary.total_cycles}</span>
                    <span className="summary-lbl">CYCLES</span>
                  </div>
                  <div className="summary-box">
                    <span className="summary-val">{data.summary.largest_tree_root || '-'}</span>
                    <span className="summary-lbl">DEEPEST ROOT</span>
                  </div>
                </div>
              </div>
            )}

            {(data.invalid_entries?.length > 0 || data.duplicate_edges?.length > 0) && (
              <div className="results-section" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                {data.invalid_entries?.length > 0 && (
                  <div>
                    <div className="section-title">INVALID ENTRIES</div>
                    <div className="invalid-tags">
                      {data.invalid_entries.map((e, idx) => (
                        <span key={idx} className="tag-invalid">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.duplicate_edges?.length > 0 && (
                  <div>
                    <div className="section-title">DUPLICATE EDGES</div>
                    <div className="dup-tags">
                      {data.duplicate_edges.map((e, idx) => (
                        <span key={idx} className="tag-dup">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {data.hierarchies?.length > 0 && (
              <div className="results-section">
                <div className="section-title">HIERARCHIES</div>
                <div className="hierarchies-grid">
                  {data.hierarchies.map((h, i) => (
                    <div key={i} className="hier-card">
                      <div className="hier-header">
                        <span className="hier-root">ROOT: {h.root}</span>
                        {h.has_cycle ? (
                          <span className="hier-badge-cycle">CYCLE</span>
                        ) : (
                          <span className="hier-badge-tree">TREE</span>
                        )}
                      </div>
                      
                      {!h.has_cycle && h.tree ? (
                        <AsciiTree tree={h.tree} />
                      ) : null}

                      {h.has_cycle ? (
                        <div className="hier-cycle-warn">// cycle detected</div>
                      ) : (
                        <div className="hier-depth">depth: {h.depth}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

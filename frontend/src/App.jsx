import { useState } from 'react';
import InputCard from './components/InputCard';
import MetaCard from './components/MetaCard';
import SummaryStrip from './components/SummaryStrip';
import HierarchiesSection from './components/HierarchiesSection';
import ValidationSection from './components/ValidationSection';
import RawJson from './components/RawJson';
import styles from './App.module.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/bfhl`;
const EXAMPLE = 'A->B, A->C, B->D, C->E, E->F, X->Y, Y->Z, Z->X, P->Q, Q->R, G->H, G->H, G->I, hello, 1->2, A->';

function parseInput(raw) {
  return raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  async function handleSubmit() {
    setError('');
    const entries = parseInput(input);
    if (!entries.length) {
      setError('Please enter at least one edge string.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: entries }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server returned ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(`API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput('');
    setData(null);
    setError('');
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          BFHL Coding Challenge
        </div>
        <h1 className={styles.title}>Graph Hierarchy Visualizer</h1>
        <p className={styles.subtitle}>
          Paste directed-edge strings, detect trees &amp; cycles, and visualize every hierarchy instantly.
        </p>
      </header>

      <InputCard
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onExample={() => setInput(EXAMPLE)}
        loading={loading}
      />

      {error && (
        <div className={styles.errorBanner}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {data && (
        <div className={styles.results}>
          <SectionTitle>Identity</SectionTitle>
          <MetaCard data={data} />

          <SectionTitle>Summary</SectionTitle>
          <SummaryStrip summary={data.summary} />

          <SectionTitle>Hierarchies</SectionTitle>
          <HierarchiesSection hierarchies={data.hierarchies} />

          <SectionTitle>Validation</SectionTitle>
          <ValidationSection
            invalidEntries={data.invalid_entries}
            duplicateEdges={data.duplicate_edges}
          />

          <RawJson data={data} />
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div className={styles.sectionTitle}>{children}</div>;
}

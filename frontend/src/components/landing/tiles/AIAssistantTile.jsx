import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
} from 'lucide-react';

const PRESET_QUERIES = [
  {
    q: 'Is Cheel Ka Teela trail safe today?',
    a: '⚠️ Cheel Ka Teela has unfenced cliff sections with high wind alerts. Please remain inside the marked Amber Fort tourist precinct.',
  },
  {
    q: 'What is the official entry fee for Amer Fort?',
    a: '🏛️ Standard Rajasthan Govt ticket is ₹100 for Indian nationals and ₹500 for foreign tourists (includes Sheesh Mahal & courtyards).',
  },
];

export default function AIAssistantTile() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedAnswer, setDisplayedAnswer] = useState(PRESET_QUERIES[0].a);

  const handleAsk = (idx) => {
    setActiveIdx(idx);
    setIsTyping(true);
    setDisplayedAnswer('');

    setTimeout(() => {
      setIsTyping(false);
      setDisplayedAnswer(PRESET_QUERIES[idx].a);
    }, 400);
  };

  return (
    <div
      className="card interactive-tile"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
      role="region"
      aria-label="AI Assistant interactive demo"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={18} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              3. AI Travel Concierge
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Ask safety & heritage queries
            </div>
          </div>
        </div>

        <span className="badge badge-warning" style={{ fontSize: '10px' }}>
          RAG AI
        </span>
      </div>

      {/* Mini Chat Window */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: '110px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* User Question */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '12px' }}>👤</span>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#ffffff',
              fontWeight: 600,
            }}
          >
            "{PRESET_QUERIES[activeIdx].q}"
          </div>
        </div>

        {/* AI Answer */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '12px' }}>🤖</span>
          <div
            style={{
              background: 'rgba(2, 132, 199, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#e2e8f0',
              lineHeight: 1.35,
            }}
          >
            {isTyping ? 'Thinking...' : displayedAnswer}
          </div>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
        {PRESET_QUERIES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(idx)}
            style={{
              flex: 1,
              padding: '4px 6px',
              borderRadius: '6px',
              background: activeIdx === idx ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeIdx === idx ? '#f59e0b' : 'var(--border-subtle)'}`,
              color: activeIdx === idx ? '#f59e0b' : 'var(--text-muted)',
              fontSize: '9px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Q{idx + 1}: {item.q.split(' ')[0]} {item.q.split(' ')[1]}...
          </button>
        ))}
      </div>

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>Postgres FTS + LLM</span>
        <span style={{ color: '#38bdf8' }}>Multilingual in 6 languages</span>
      </div>
    </div>
  );
}

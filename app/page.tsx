'use client';

import React, { useState } from 'react';
import JsonViewer from '@/components/JsonViewer';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      alert('Invalid JSON');
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setSearchTerm('');
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1f2937',
          textAlign: 'center'
        }}>
          JSON Viewer
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#6b7280',
          marginBottom: '30px'
        }}>
          Paste your JSON and explore it with an interactive viewer
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Input Section */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                JSON Input
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleFormat}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Format
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON here..."
              style={{
                width: '100%',
                minHeight: '500px',
                padding: '15px',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                resize: 'vertical',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                lineHeight: '1.6'
              }}
            />
          </div>

          {/* Viewer Section */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <label style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                JSON Viewer
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px',
                    width: '150px'
                  }}
                />
              </div>
            </div>
            <div style={{
              minHeight: '500px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              padding: '15px'
            }}>
              <JsonViewer json={jsonInput} searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


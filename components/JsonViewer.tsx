'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface JsonNode {
  key: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  isExpanded: boolean;
  path: string;
}

interface JsonViewerProps {
  json: string;
  searchTerm?: string;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ json, searchTerm = '' }) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(json);
      setParsedJson(parsed);
      setError('');
      // Expand root by default
      setExpandedPaths(new Set(['root']));
    } catch (e) {
      setError('Invalid JSON');
      setParsedJson(null);
    }
  }, [json]);

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    const collectPaths = (obj: any, path: string) => {
      allPaths.add(path);
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            collectPaths(item, `${path}.${index}`);
          });
        } else {
          Object.keys(obj).forEach(key => {
            collectPaths(obj[key], `${path}.${key}`);
          });
        }
      }
    };
    if (parsedJson !== null) {
      collectPaths(parsedJson, 'root');
    }
    setExpandedPaths(allPaths);
  };

  const collapseAll = () => {
    setExpandedPaths(new Set(['root']));
  };

  const getValueType = (value: any): 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null' => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value as 'string' | 'number' | 'boolean';
  };

  const hasMatchingChild = (value: any, path: string): boolean => {
    if (!searchTerm) return true;
    const type = getValueType(value);
    if (type === 'object' || type === 'array') {
      const keys = type === 'array' 
        ? Array.from({ length: value.length }, (_, i) => i.toString())
        : Object.keys(value);
      return keys.some(key => {
        const childPath = `${path}.${key}`;
        const childValue = value[key];
        return matchesSearch(childValue, childPath) || hasMatchingChild(childValue, childPath);
      });
    }
    return false;
  };

  const matchesSearch = (value: any, path: string): boolean => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const valueStr = JSON.stringify(value).toLowerCase();
    const pathStr = path.toLowerCase();
    return valueStr.includes(searchLower) || pathStr.includes(searchLower);
  };

  const renderValue = (value: any, path: string, depth: number = 0): React.ReactNode => {
    const matches = matchesSearch(value, path) || hasMatchingChild(value, path);
    if (!matches) return null;

    const type = getValueType(value);
    const isExpanded = expandedPaths.has(path);
    const indent = depth * 20;

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'string': return '#50a14f';
        case 'number': return '#986801';
        case 'boolean': return '#c18401';
        case 'null': return '#a626a4';
        default: return '#383a42';
      }
    };

    const getBracketColor = (type: string) => {
      return type === 'object' ? '#e06c75' : '#c678dd';
    };

    if (type === 'object' || type === 'array') {
      const keys = type === 'array' 
        ? Array.from({ length: value.length }, (_, i) => i.toString())
        : Object.keys(value);
      
      const hasContent = keys.length > 0;
      const bracketOpen = type === 'object' ? '{' : '[';
      const bracketClose = type === 'array' ? ']' : '}';

      return (
        <div key={path} style={{ marginLeft: `${indent}px` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              onClick={() => toggleExpand(path)}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                fontSize: '12px',
                marginRight: '5px',
                color: '#383a42',
                fontWeight: 'bold'
              }}
            >
              {hasContent ? (isExpanded ? '▼' : '▶') : ''}
            </span>
            <span style={{ color: getBracketColor(type), fontWeight: 'bold' }}>{bracketOpen}</span>
            {!isExpanded && hasContent && (
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                ... {keys.length} {type === 'array' ? 'items' : 'keys'}
              </span>
            )}
            {!isExpanded && <span style={{ color: getBracketColor(type), fontWeight: 'bold' }}>{bracketClose}</span>}
          </div>
          {isExpanded && hasContent && (
            <div>
              {keys.map((key, index) => {
                const childPath = type === 'array' ? `${path}.${key}` : `${path}.${key}`;
                const childValue = value[key];
                const childType = getValueType(childValue);
                
                return (
                  <div key={childPath} style={{ marginTop: '2px' }}>
                    {type === 'object' && (
                      <span style={{ color: '#4078f2', marginRight: '5px' }}>
                        "{key}":
                      </span>
                    )}
                    {renderValue(childValue, childPath, depth + 1)}
                    {index < keys.length - 1 && (
                      <span style={{ color: '#383a42', marginLeft: '5px' }}>,</span>
                    )}
                  </div>
                );
              })}
              <div style={{ marginLeft: `${indent}px` }}>
                <span style={{ color: getBracketColor(type), fontWeight: 'bold' }}>{bracketClose}</span>
              </div>
            </div>
          )}
          {!hasContent && (
            <span style={{ color: getBracketColor(type), fontWeight: 'bold' }}>{bracketClose}</span>
          )}
        </div>
      );
    }

    // Primitive values
    let displayValue: string;
    let color = getTypeColor(type);
    
    if (type === 'string') {
      displayValue = `"${value}"`;
    } else if (type === 'null') {
      displayValue = 'null';
    } else {
      displayValue = String(value);
    }

    return (
      <span key={path} style={{ color, marginLeft: `${indent}px` }}>
        {displayValue}
      </span>
    );
  };

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#e06c75', 
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        border: '1px solid #fecaca'
      }}>
        {error}
      </div>
    );
  }

  if (parsedJson === null) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        Paste JSON to view
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        marginBottom: '10px', 
        display: 'flex', 
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <button
          onClick={expandAll}
          style={{
            padding: '6px 12px',
            backgroundColor: '#4078f2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Collapse All
        </button>
      </div>
      <div style={{ 
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        padding: '15px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        maxHeight: '600px',
        overflow: 'auto'
      }}>
        {renderValue(parsedJson, 'root', 0)}
      </div>
    </div>
  );
};

export default JsonViewer;


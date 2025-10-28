import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PagePreview from './PagePreview';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [filters, setFilters] = useState({
    tags: '',
    fromDate: '',
    toDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (q || filters.tags || filters.fromDate || filters.toDate) {
      doSearch();
    }
  }, [page]);

  async function doSearch(e) {
    if (e) {
      e.preventDefault();
      setPage(1);
    }

    setLoading(true);
    try {
      const params = {
        q,
        page,
        size: 10,
        ...filters
      };

      const res = await axios.get(`${API}/api/search`, { params });
      setResults(res.data.results);
      setTotalResults(res.data.total || res.data.results.length);
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function loadDocument(docId) {
    try {
      const res = await axios.get(`${API}/api/search`, { 
        params: { q: '', page: 1, size: 1 } 
      });
      const doc = results.find(r => r.document._id === docId)?.document;
      setSelectedDoc(doc);
    } catch (err) {
      console.error('Error loading document:', err);
    }
  }

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Search Documents</h2>

      <div style={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        <form onSubmit={doSearch}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search for text in documents..."
              style={{ flex: 1, padding: 12, fontSize: 16 }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px 24px', fontSize: 16 }}
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: 'transparent',
                color: '#007bff',
                border: '1px solid #007bff',
                padding: '6px 12px',
                fontSize: 14
              }}
            >
              {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
            </button>

            {(q || filters.tags || filters.fromDate || filters.toDate) && (
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  setFilters({ tags: '', fromDate: '', toDate: '' });
                  setResults([]);
                  setPage(1);
                }}
                style={{
                  background: '#dc3545',
                  padding: '6px 12px',
                  fontSize: 14
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {showFilters && (
            <div style={{
              marginTop: 16,
              padding: 16,
              backgroundColor: '#f8f9fa',
              borderRadius: 4,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={filters.tags}
                  onChange={e => setFilters({ ...filters, tags: e.target.value })}
                  placeholder="tag1, tag2"
                  style={{ width: '100%', padding: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={e => setFilters({ ...filters, toDate: e.target.value })}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{
            display: 'inline-block',
            width: 40,
            height: 40,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ marginTop: 12 }}>Searching...</div>
        </div>
      )}

      {!loading && results.length === 0 && (q || filters.tags) && (
        <div style={{
          backgroundColor: 'white',
          padding: 40,
          borderRadius: 8,
          textAlign: 'center',
          color: '#666'
        }}>
          No documents found matching your search.
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
            Found {totalResults} result{totalResults !== 1 ? 's' : ''}
            {q && ` for "${q}"`}
          </div>

          {results.map(r => (
            <div
              key={r.document._id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 20,
                marginBottom: 16,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              onClick={() => loadDocument(r.document._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: '#007bff' }}>
                  📄 {r.document.title}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 12,
                  backgroundColor: getStatusColor(r.document.ocrState),
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {r.document.ocrState.toUpperCase()}
                </span>
              </div>

              {r.snippet && (
                <div style={{
                  padding: 12,
                  backgroundColor: '#f8f9fa',
                  borderLeft: '3px solid #007bff',
                  marginBottom: 12,
                  fontSize: 14,
                  lineHeight: 1.6
                }}
                  dangerouslySetInnerHTML={{ __html: highlight(r.snippet, q) }}
                />
              )}

              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#666' }}>
                <span>📅 {new Date(r.document.uploadedAt).toLocaleDateString()}</span>
                <span>📊 {r.document.pages?.length || 0} pages</span>
                {r.pageNum > 0 && <span>📍 Match on page {r.pageNum}</span>}
              </div>

              {r.document.tags && r.document.tags.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {r.document.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: 12,
                        fontSize: 12
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 24
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '8px 16px' }}
              >
                ← Previous
              </button>

              <span style={{
                padding: '8px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center'
              }}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: '8px 16px' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {selectedDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
          onClick={() => setSelectedDoc(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 8,
              maxWidth: 900,
              maxHeight: '90vh',
              overflow: 'auto',
              width: '90%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2>{selectedDoc.title}</h2>
              <button onClick={() => setSelectedDoc(null)} style={{ background: '#dc3545' }}>
                ✕ Close
              </button>
            </div>

            {selectedDoc.pages && selectedDoc.pages.map(page => (
              <PagePreview key={page.pageNumber} page={page} searchQuery={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    queued: '#6c757d',
    processing: '#ffc107',
    done: '#28a745',
    failed: '#dc3545'
  };
  return colors[status] || '#6c757d';
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function highlight(text, q) {
  if (!q || !text) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const re = new RegExp(`(${escapeRegex(q)})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

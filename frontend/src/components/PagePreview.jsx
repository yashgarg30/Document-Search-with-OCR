import React, { useState } from 'react';

export default function PagePreview({ page, searchQuery }) {
  const [showWords, setShowWords] = useState(false);

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i}>{part}</mark> 
        : part
    );
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 85) return '#4caf50';
    if (conf >= 70) return '#ff9800';
    return '#f44336';
  };

  const getQualityBadge = (conf) => {
    if (conf >= 85) return { text: 'Excellent', color: '#4caf50' };
    if (conf >= 70) return { text: 'Good', color: '#ff9800' };
    if (conf >= 50) return { text: 'Fair', color: '#ff9800' };
    return { text: 'Poor', color: '#f44336' };
  };

  const quality = getQualityBadge(page.confidence);

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      backgroundColor: 'white'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12
      }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>
          Page {page.pageNumber}
        </h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 'bold',
            backgroundColor: quality.color,
            color: 'white'
          }}>
            {quality.text}
          </span>
          <span style={{ 
            fontSize: 14, 
            color: '#666',
            fontWeight: 'bold'
          }}>
            Confidence: {Math.round(page.confidence)}%
          </span>
        </div>
      </div>

      {page.lowQuality && (
        <div style={{
          padding: 10,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: 4,
          marginBottom: 12,
          fontSize: 13
        }}>
          ⚠️ Low quality detected. Consider re-processing with different settings.
        </div>
      )}

      <div style={{
        maxHeight: 200,
        overflowY: 'auto',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: 'Georgia, serif',
        whiteSpace: 'pre-wrap'
      }}>
        {highlightText(page.text, searchQuery)}
      </div>

      {page.words && page.words.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <button 
            onClick={() => setShowWords(!showWords)}
            style={{
              background: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              padding: '6px 12px',
              fontSize: 12
            }}
          >
            {showWords ? 'Hide' : 'Show'} Word Details ({page.words.length} words)
          </button>

          {showWords && (
            <div style={{
              marginTop: 12,
              maxHeight: 300,
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: 12
            }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ padding: 8, textAlign: 'left' }}>Word</th>
                    <th style={{ padding: 8, textAlign: 'left' }}>Position</th>
                    <th style={{ padding: 8, textAlign: 'left' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {page.words.slice(0, 100).map((word, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>
                        {highlightText(word.text, searchQuery)}
                      </td>
                      <td style={{ padding: 8, fontSize: 11, color: '#666' }}>
                        ({Math.round(word.bbox.x0)}, {Math.round(word.bbox.y0)})
                      </td>
                      <td style={{ padding: 8 }}>
                        <span style={{ 
                          color: getConfidenceColor(word.conf),
                          fontWeight: 'bold'
                        }}>
                          {Math.round(word.conf)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {page.words.length > 100 && (
                    <tr>
                      <td colSpan="3" style={{ padding: 8, textAlign: 'center', color: '#666' }}>
                        ... and {page.words.length - 100} more words
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {page.processedAt && (
        <div style={{ 
          marginTop: 12, 
          fontSize: 12, 
          color: '#999',
          textAlign: 'right'
        }}>
          Processed: {new Date(page.processedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

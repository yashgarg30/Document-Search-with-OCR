import React from 'react';

export default function Progress({ value, max = 100, label, showPercentage = true }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  const getColor = () => {
    if (percentage < 33) return '#ff6b6b';
    if (percentage < 66) return '#ffd93d';
    return '#6bcf7f';
  };

  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      {label && (
        <div style={{ marginBottom: 5, fontSize: 14, color: '#666' }}>
          {label}
          {showPercentage && <span style={{ float: 'right' }}>{percentage}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: 24,
          backgroundColor: '#e0e0e0',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: getColor(),
            transition: 'width 0.3s ease',
            borderRadius: 12
          }}
        />
        {showPercentage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: percentage > 50 ? 'white' : '#333'
            }}
          >
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );
}

export function CircularProgress({ size = 40, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div style={{ display: 'inline-block' }}>
      <svg width={size} height={size} style={{ animation: 'spin 1s linear infinite' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#007bff"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

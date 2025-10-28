import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Progress from './Progress';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

const LANGUAGES = {
  eng: 'English',
  fra: 'French',
  deu: 'German',
  spa: 'Spanish',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  ara: 'Arabic',
  chi_sim: 'Chinese Simplified',
  jpn: 'Japanese',
  kor: 'Korean'
};

const PREPROCESS_PRESETS = {
  none: 'No Preprocessing',
  document: 'Document (Standard)',
  scan: 'Scan (High Quality)',
  photo: 'Photo',
  lowQuality: 'Low Quality / Faded'
};

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [docId, setDocId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [language, setLanguage] = useState('eng');
  const [preset, setPreset] = useState('document');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    if (!docId) return;
    
    const socket = io(API);
    
    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
      setLogs(l => [...l, '🔌 Connected to server']);
    });

    socket.emit('joinDoc', docId);

    socket.on('ocr:progress', (data) => {
      setProgress({ current: data.page, total: data.total });
      setStatus(`Processing page ${data.page} of ${data.total}...`);
    });

    socket.on('ocr:pageDone', data => {
      const conf = Math.round(data.confidence);
      const quality = data.lowQuality ? '⚠️' : '✅';
      setLogs(l => [...l, `${quality} Page ${data.page} complete (confidence: ${conf}%)`]);
    });

    socket.on('ocr:done', () => {
      setStatus('✅ OCR Complete!');
      setLogs(l => [...l, '🎉 Document processing finished']);
      setProgress({ current: 0, total: 0 });
    });

    socket.on('ocr:error', e => {
      setStatus('❌ Error occurred');
      setError(e.error);
      setLogs(l => [...l, `❌ Error: ${e.error}`]);
    });

    socket.on('disconnect', () => {
      setLogs(l => [...l, '🔌 Disconnected from server']);
    });

    return () => socket.disconnect();
  }, [docId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setIsDuplicate(false);
      setLogs([`📄 Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  async function submit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setStatus('Uploading...');
    setLogs(l => [...l, '⬆️ Uploading file...']);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('languages', language);
      
      if (preset !== 'none') {
        fd.append('preprocess', JSON.stringify({ preset }));
      }

      const res = await axios.post(`${API}/api/upload`, fd, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setStatus(`Uploading... ${percent}%`);
        }
      });

      if (res.data.duplicated) {
        setIsDuplicate(true);
        setDocId(res.data.documentId);
        setStatus('⚠️ Duplicate file detected');
        setLogs(l => [...l, '⚠️ This file has already been uploaded']);
      } else if (res.data.documentId) {
        setDocId(res.data.documentId);
        setStatus('✅ Uploaded! Processing started...');
        setLogs(l => [...l, '✅ Upload complete', '⚙️ OCR processing started...']);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setStatus('❌ Upload failed');
      setLogs(l => [...l, `❌ Upload error: ${err.message}`]);
    } finally {
      setUploading(false);
    }
  }

  const reset = () => {
    setFile(null);
    setDocId(null);
    setStatus('');
    setLogs([]);
    setProgress({ current: 0, total: 0 });
    setError('');
    setIsDuplicate(false);
    setUploading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Upload Document for OCR</h2>

      <div style={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: 20
      }}>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
              Select File (PDF or Image)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ width: '100%', padding: 8 }}
            />
            {file && (
              <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                Selected: {file.name} ({formatFileSize(file.size)})
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={uploading}
                style={{ width: '100%', padding: 8 }}
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                Preprocessing
              </label>
              <select
                value={preset}
                onChange={e => setPreset(e.target.value)}
                disabled={uploading}
                style={{ width: '100%', padding: 8 }}
              >
                {Object.entries(PREPROCESS_PRESETS).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <button
              type="submit"
              disabled={!file || uploading}
              style={{
                width: '100%',
                padding: 12,
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              {uploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>

          {docId && (
            <button
              type="button"
              onClick={reset}
              style={{
                width: '100%',
                background: '#6c757d'
              }}
            >
              Upload Another Document
            </button>
          )}
        </form>

        {error && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: 4,
            color: '#721c24'
          }}>
            {error}
          </div>
        )}

        {isDuplicate && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: 4,
            color: '#856404'
          }}>
            ⚠️ This file has already been uploaded. Document ID: {docId}
          </div>
        )}
      </div>

      {status && (
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: 20
        }}>
          <h3 style={{ marginBottom: 12 }}>Status</h3>
          <div style={{ fontSize: 16, marginBottom: 12 }}>{status}</div>
          
          {progress.total > 0 && (
            <Progress
              value={progress.current}
              max={progress.total}
              label={`Processing pages`}
              showPercentage={true}
            />
          )}
        </div>
      )}

      {logs.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: 12 }}>Processing Log</h3>
          <div style={{
            maxHeight: 300,
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            padding: 12,
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <span style={{ color: '#999' }}>[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {docId && !isDuplicate && (
        <div style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: 4,
          color: '#0c5460'
        }}>
          <strong>Document ID:</strong> {docId}
          <br />
          <small>You can use this ID to check the document status or search for it later.</small>
        </div>
      )}
    </div>
  );
}

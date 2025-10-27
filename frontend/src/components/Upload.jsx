import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

export default function Upload(){
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [docId, setDocId] = useState(null);
  const [logs, setLogs] = useState([]);
  useEffect(()=> {
    if (!docId) return;
    const socket = io(API);
    socket.on('connect', ()=>console.log('connected', socket.id));
    socket.emit('joinDoc', docId);
    socket.on('ocr:progress', (d) => setStatus(`Page ${d.page} / ${d.total} processing`));
    socket.on('ocr:pageDone', d => setLogs(l=>[...l, `Page ${d.page} done conf=${Math.round(d.confidence)}`]));
    socket.on('ocr:done', d => setStatus('OCR done'));
    socket.on('ocr:error', e => setStatus('Error: ' + e.error));
    socket.on('ocr:log', m => setLogs(l=>[...l, JSON.stringify(m)]));
    return () => socket.disconnect();
  }, [docId]);

  async function submit(e){
    e.preventDefault();
    if (!file) return alert('choose a file');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('languages', 'eng'); // could be UI
    const res = await axios.post(`${API}/api/upload`, fd);
    if (res.data.documentId) setDocId(res.data.documentId);
    setStatus('Uploaded, queued for OCR');
  }

  return (
    <div style={{padding:20}}>
      <h2>Upload document</h2>
      <form onSubmit={submit}>
        <input type="file" accept=".pdf,image/*" onChange={e=>setFile(e.target.files[0])}/>
        <button type="submit">Upload</button>
      </form>
      <div style={{marginTop:10}}><strong>Status:</strong> {status}</div>
      <div style={{marginTop:10}}>
        <h4>Logs</h4>
        <div style={{whiteSpace:'pre-wrap', fontFamily:'monospace'}}>{logs.join('\n')}</div>
      </div>
    </div>
  );
}

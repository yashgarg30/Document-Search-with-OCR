import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API || 'http://localhost:4000';

export default function Search(){
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  async function doSearch(e){
    e.preventDefault();
    const res = await axios.get(`${API}/api/search`, { params: { q }});
    setResults(res.data.results);
  }

  return (
    <div style={{padding:20}}>
      <h2>Search</h2>
      <form onSubmit={doSearch}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="search text"/>
        <button>Search</button>
      </form>
      <div>
        {results.map(r=>(
          <div key={r.document._id} style={{border:'1px solid #ddd', padding:10, marginTop:8}}>
            <h4>{r.document.title}</h4>
            <div dangerouslySetInnerHTML={{__html: highlight(r.snippet, q)}} />
            <div>
              <button onClick={()=>window.open(`/api/doc/${r.document._id}/page/${r.pageNum}`)}>Open page {r.pageNum}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeHtml(s){
  if (!s) return '';
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function highlight(text, q){
  if (!q) return escapeHtml(text);
  const re = new RegExp(`(${q})`, 'ig');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

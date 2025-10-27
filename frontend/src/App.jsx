import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Upload from './components/Upload';
import Search from './components/Search';

export default function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:10, borderBottom:'1px solid #ddd'}}>
        <Link to="/">Upload</Link> | <Link to="/search">Search</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Upload/>}/>
        <Route path="/search" element={<Search/>}/>
      </Routes>
    </BrowserRouter>
  );
}

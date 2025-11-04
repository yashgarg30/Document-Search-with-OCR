import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import ProcessingStatus from "./components/ProcessingStatus";
import SearchBox from "./components/SearchBox";
import FileViewer from "./components/FileViewer";
import About from "./components/About"; 
import "./styles.css";

export default function App() {
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState("home");
  const [showHelp, setShowHelp] = useState(false);

  // Dark Mode state (persistent)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      {/* === Navigation Bar === */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <span className="nav-logo">📁</span>
            <span className="nav-title">DocReader</span>
          </div>

          <div className="nav-links">
            <a
              href="#"
              className={`nav-link ${page === "home" ? "active" : ""}`}
              onClick={() => setPage("home")}
            >
              Home
            </a>
            <a
              href="#"
              className={`nav-link ${page === "documents" ? "active" : ""}`}
              onClick={() => setPage("documents")}
            >
              Documents
            </a>
            <a
              href="#"
              className={`nav-link ${page === "about" ? "active" : ""}`}
              onClick={() => setPage("about")}
            >
              About
            </a>
          </div>

          <div className="nav-actions">
            <button
              className="nav-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              className="nav-btn"
              onClick={() => setShowHelp(true)}
            >
              Help
            </button>
          </div>
        </div>
      </nav>

      {/* === Page Content === */}
      <div className="container">
        {/* === Home Page === */}
        {page === "home" && (
          <div className="header-card">
            <h1>📁 Document Reader & Search</h1>
            <p className="subtitle">
              Select a file from your device or drag & drop below
            </p>

            {!fileData && (
              <FileUpload setFileData={setFileData} setProcessing={setLoading} />
            )}

            {fileData && (
              <>
                <button
                  className="upload-btn"
                  onClick={() => {
                    setFileData(null);
                    setQuery("");
                  }}
                >
                  Upload another file
                </button>

                <SearchBox
                  searchWord={query}
                  setSearchWord={setQuery}
                  fileData={fileData}
                />
              </>
            )}

            {loading && <ProcessingStatus />}

            {fileData && (
              <div className="content-section">
                <FileViewer fileData={fileData} searchQuery={query} />
              </div>
            )}
          </div>
        )}

        {/* === Documents Page === */}
        {page === "documents" && (
          <div className="header-card coming-soon-card">
            <h1>📚 Documents</h1>
            <p className="subtitle">
              Features coming soon 🚀  
              <br />
              We’re working on cloud storage, smart tagging, and collaboration tools.
            </p>

            <div className="feature-preview-grid">
              <div className="feature-preview">
                <h3>☁️ Cloud Storage</h3>
                <p>Save and organize your uploaded documents securely online.</p>
              </div>
              <div className="feature-preview">
                <h3>🤝 Team Collaboration</h3>
                <p>Share documents with your team and collaborate in real time.</p>
              </div>
              <div className="feature-preview">
                <h3>🔍 Smart Search</h3>
                <p>Find text instantly across multiple uploaded files using AI-powered search.</p>
              </div>
            </div>
          </div>
        )}

        {/* === About Page === */}
        {page === "about" && <About />}
      </div>

      {/* === Help Modal === */}
      {showHelp && (
        <div className="help-modal">
          <div className="help-content">
            <h2>📞 Need Help?</h2>
            <p>If you have questions or need assistance, contact us:</p>
            <p><strong>📧 Email:</strong> support@docreader.com</p>
            <p><strong>📱 Phone:</strong> +1 (800) 555-1234</p>
            <button className="close-btn" onClick={() => setShowHelp(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";

/**
 * SearchBox only updates the query state in parent (App).
 * It computes a local count using fileData.text (if present) and shows it.
 */

export default function SearchBox({ searchWord, setSearchWord, fileData }) {
  const [resultCount, setResultCount] = useState(null);

  // escape regex special chars
  const escapeRegExp = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  useEffect(() => {
    if (!fileData || !searchWord) {
      setResultCount(null);
      return;
    }

    const q = searchWord.trim();
    if (!q) {
      setResultCount(null);
      return;
    }

    const esc = escapeRegExp(q);
    const re = new RegExp(esc, "gi");

    let count = 0;

    // count matches in the main extracted text (PDF/TXT/DOCX/PPTX combined text)
    if (fileData.text) {
      const matches = fileData.text.match(re);
      if (matches) count += matches.length;
    }

    // for sheets, count matches per cell
    if (fileData.sheets && Array.isArray(fileData.sheets)) {
      fileData.sheets.forEach((sheet) => {
        sheet.rows.forEach((row) => {
          row.forEach((cell) => {
            const cellStr = String(cell ?? "");
            const m = cellStr.match(re);
            if (m) count += m.length;
          });
        });
      });
    }

    // slides (pptx) may have their own text
    if (fileData.slides && Array.isArray(fileData.slides)) {
      fileData.slides.forEach((s) => {
        const m = String(s.text ?? "").match(re);
        if (m) count += m.length;
      });
    }

    setResultCount(count);
  }, [searchWord, fileData]);

  return (
    <div className="search-box" style={{ marginTop: 12 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // parent App already has searchWord state; pressing enter just keeps it
        }}
      >
        <input
          type="text"
          placeholder="Search text..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          style={{ padding: "6px 8px", width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: "6px 10px" }}>
          Search
        </button>
      </form>

      {resultCount !== null && (
        <p style={{ marginTop: 8 }}>
          {resultCount > 0 ? `${resultCount} match${resultCount > 1 ? "es" : ""} found.` : "No matches found."}
        </p>
      )}
    </div>
  );
}

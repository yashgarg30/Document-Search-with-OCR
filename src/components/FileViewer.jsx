import React, { useEffect, useRef } from "react";

// Escape regex safely
const escapeRegExp = (string = "") =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Escape HTML safely
const escapeHtml = (unsafe = "") =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ✅ Improved highlight that keeps newlines and paragraphs
const highlightTextPlain = (text = "", query = "") => {
  try {
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs
      .map((para) => {
        let safe = escapeHtml(para).replace(/\n/g, "<br/>");
        if (query) {
          const esc = escapeRegExp(query);
          const re = new RegExp(esc, "gi");
          safe = safe.replace(
            re,
            (match) => `<mark class="highlight">${match}</mark>`
          );
        }
        return `<p>${safe}</p>`;
      })
      .join("");
  } catch (err) {
    console.error("Highlight error:", err);
    return escapeHtml(text).replace(/\n/g, "<br/>");
  }
};

// Highlight inside Excel or CSV cells
const highlightCell = (cell = "", query = "") => {
  if (!query) return escapeHtml(String(cell ?? ""));
  const esc = escapeRegExp(query);
  const re = new RegExp(esc, "gi");
  return escapeHtml(String(cell ?? "")).replace(
    re,
    (m) => `<mark class="highlight">${m}</mark>`
  );
};

export default function FileViewer({ fileData, searchQuery }) {
  const docRef = useRef(null);

  useEffect(() => {
    if (!fileData || !docRef.current) return;

    try {
      const query = (searchQuery || "").trim();

      // DOCX (Mammoth HTML)
      if (fileData.html) {
        const htmlContent = query
          ? fileData.html.replace(
              new RegExp(escapeRegExp(query), "gi"),
              (m) => `<mark class="highlight">${m}</mark>`
            )
          : fileData.html;
        docRef.current.innerHTML = htmlContent;
        return;
      }

      // PDF / TXT
      if (fileData.text && !fileData.sheets && !fileData.csv) {
        const html = highlightTextPlain(fileData.text, query);
        docRef.current.innerHTML = `<div class="text-content">${html}</div>`;
        return;
      }

      // XLSX / XLS
      if (fileData.sheets && Array.isArray(fileData.sheets)) {
        const sheetsHtml = fileData.sheets
          .map((sheet) => {
            const rowsHtml = sheet.rows
              .map(
                (row) =>
                  `<tr>${row
                    .map((cell) => `<td>${highlightCell(cell, query)}</td>`)
                    .join("")}</tr>`
              )
              .join("");
            return `
              <h4>${escapeHtml(sheet.name)}</h4>
              <div style="overflow-x:auto">
                <table border="1" style="border-collapse:collapse;width:100%">
                  <tbody>${rowsHtml}</tbody>
                </table>
              </div>`;
          })
          .join("<br/>");

        docRef.current.innerHTML = sheetsHtml;
        return;
      }

      // 🧾 CSV
if (fileData.csv && Array.isArray(fileData.csv)) {
  // Remove empty rows (rows where all cells are empty or whitespace)
  const filteredRows = fileData.csv.filter((row) =>
    row.some((cell) => String(cell).trim() !== "")
  );

  const rowsHtml = filteredRows
    .map((row) => {
      // Filter out empty cells and trim content
      const nonEmptyCells = row.filter(
        (cell) => String(cell).trim() !== ""
      );
      if (nonEmptyCells.length === 0) return ""; // skip empty rows
      return `<tr>${nonEmptyCells
        .map((cell) => `<td>${highlightCell(cell, query)}</td>`)
        .join("")}</tr>`;
    })
    .join("");

    const csvHtml = `
      <div style="overflow-x:auto">
        <table border="1" style="border-collapse:collapse;width:100%">
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
    docRef.current.innerHTML = csvHtml;
    return;
  }
  
      // PPTX
      if (fileData.slides && Array.isArray(fileData.slides)) {
        const slidesHtml = fileData.slides
          .map(
            (slide) => `
            <div class="slide" style="margin-bottom: 16px; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
              <h4>${escapeHtml(slide.title || "")}</h4>
              <div>${highlightTextPlain(slide.text || "", query)}</div>
            </div>`
          )
          .join("");
        docRef.current.innerHTML = slidesHtml;
        return;
      }

      docRef.current.innerHTML = "<p>No content available.</p>";
    } catch (err) {
      console.error("Render error:", err);
      docRef.current.innerHTML =
        "<p style='color:red'>Error displaying file.</p>";
    }
  }, [fileData, searchQuery]);

  if (!fileData) return null;

  const { name, type, blobUrl } = fileData;

  return (
    <div className="file-viewer">
      <h3 style={{ marginTop: 12 }}>{name}</h3>

      {/* PDF viewer */}
      {type === "pdf" && blobUrl && (
        <iframe
          title="pdf-view"
          src={blobUrl}
          style={{
            width: "100%",
            height: "600px",
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
      )}

      {/* Render text, tables, or slides */}
      <div
        ref={docRef}
        className="file-content"
        style={{
          background: "#fafafa",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #eee",
          whiteSpace: "normal",
          marginTop: "12px",
        }}
      ></div>
    </div>
  );
}

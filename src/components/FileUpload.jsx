import React from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import JSZip from "jszip";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUpload({ setFileData, setProcessing }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);

    try {
      const ext = file.name.split(".").pop().toLowerCase();
      const result = {
        name: file.name,
        type: ext,
        blobUrl: null,
        pages: [],
        text: "",
        html: null,
        sheets: null,
        slides: null,
        csv: null,
      };

      if (ext === "pdf") {
        // 📘 PDF
        const blob = new Blob([await file.arrayBuffer()], {
          type: file.type || "application/pdf",
        });
        result.blobUrl = URL.createObjectURL(blob);

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let txt = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          txt += content.items.map((it) => it.str).join(" ") + "\n\n";

          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          result.pages.push(canvas.toDataURL());
        }
        result.text = txt.trim();
      } else if (ext === "docx") {
        // 📄 DOCX
        const arrayBuffer = await file.arrayBuffer();
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        const rawTextResult = await mammoth.extractRawText({ arrayBuffer });
        result.html = htmlResult.value;
        result.text = rawTextResult.value;
      } else if (ext === "xlsx" || ext === "xls") {
        // 📊 EXCEL
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheets = workbook.SheetNames.map((name) => {
          const sheet = workbook.Sheets[name];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          return { name, rows: json };
        });
        let csvText = "";
        sheets.forEach((s) => {
          csvText += `Sheet: ${s.name}\n`;
          s.rows.forEach((r) => {
            csvText += r.join("\t") + "\n";
          });
          csvText += "\n";
        });
        result.sheets = sheets;
        result.text = csvText.trim();
      } else if (ext === "pptx") {
        // 📽️ PPTX
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const slideFiles = Object.keys(zip.files).filter((n) =>
          n.match(/ppt\/slides\/slide\d+\.xml$/)
        );
        const slides = [];

        for (const slideName of slideFiles) {
          const content = await zip.files[slideName].async("string");
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, "text/xml");

          const textNodes = Array.from(xmlDoc.getElementsByTagName("a:t"));
          const slideText = textNodes.map((node) => node.textContent).join(" ");
          slides.push({ title: `Slide ${slides.length + 1}`, text: slideText });
        }

        result.slides = slides;
        result.text = slides.map((s) => `${s.title}: ${s.text}`).join("\n\n");
      } else if (ext === "csv") {
        // 🧾 CSV
        const text = await file.text();
        const rows = text
          .split("\n")
          .filter((r) => r.trim() !== "")
          .map((r) => r.split(","));
        result.csv = rows;
        result.text = rows.map((r) => r.join(" | ")).join("\n");
      } else {
        // 📜 TXT or others
        result.text = await file.text();
      }

      setFileData(result);
    } catch (err) {
      console.error("File processing error:", err);
      alert("Error processing file. See console for details.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="upload-area"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add("drag-over");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("drag-over");
      }}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove("drag-over");

        const file = e.dataTransfer.files?.[0];
        if (file) {
          await handleFileChange({ target: { files: [file] } });
        }
      }}
    >
      <input
        type="file"
        id="fileInput"
        accept=".pdf,.docx,.xlsx,.xls,.pptx,.txt,.csv"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput" className="upload-label">
        Click to upload or drag a file here
      </label>
    </div>
  );
}

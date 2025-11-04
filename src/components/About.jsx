import React from "react";
import "../styles.css";

export default function About() {
  return (
    <div className="about-section">
    <h1>About DocReader</h1>
    <p>
        <strong>DocReader</strong> is a modern web application that allows you to upload, read, and
        search through your documents with speed and simplicity. Designed for professionals, students,
        and researchers, it eliminates the hassle of manually scanning through lengthy documents.
    </p>
    <p>
        With <strong>DocReader</strong>, you can effortlessly upload files in formats such as
        <strong> PDF, PPT, EXCEL, DOCX, CSV,</strong> and <strong>TXT</strong>. Once uploaded, the built-in smart search
        engine helps you instantly locate keywords or phrases within your documents — saving you valuable
        time and boosting productivity.
    </p>
    <p>
        The application is powered by <strong>React</strong> and optimized for performance using
        modern front-end technologies. Its interface is clean, responsive, and adaptable across devices,
        ensuring a consistent experience on desktops, tablets, and mobile screens.
    </p>
    <p>
        <strong>Key Features:</strong>
    </p>
    <ul>
        <li>📂 Upload and preview multiple document types</li>
        <li>🔍 Lightning-fast keyword and phrase search</li>
        <li>🧠 Intelligent file handling with optimized rendering</li>
        <li>🌈 Smooth, minimal design with gradient aesthetics</li>
        <li>⚙️ Powered by React, with modular and scalable architecture</li>
    </ul>
    <p>
        Whether you're organizing research papers, analyzing reports, or reviewing contracts,
        <strong> DocReader</strong> is your reliable companion for smarter and faster document management.
    </p>
    <hr />
    <p className="about-footer">
        💡 Built with React, styled with love, and powered by simplicity.
    </p>
    </div>
  );
}

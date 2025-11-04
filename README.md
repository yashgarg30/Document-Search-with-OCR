# 📁 DocReader - Document Reader & Search

**A College Project Submission**

A modern, feature-rich web application for uploading, viewing, and searching through various document formats with speed and simplicity. This project demonstrates advanced React development skills, file processing capabilities, and modern web design principles.

![DocReader](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 📚 Project Overview

### Purpose
This project was developed as part of the college curriculum to demonstrate proficiency in:
- Modern web development using React
- File handling and processing in the browser
- Building responsive and accessible user interfaces
- Implementing search algorithms and text processing
- Creating a full-stack application architecture

### Problem Statement
Traditional document viewers lack integrated search capabilities and support for multiple file formats. This application solves this problem by providing a unified platform where users can upload, view, and search through different document types seamlessly.

### Objectives
1. Create a user-friendly interface for document management
2. Implement support for multiple file formats (PDF, DOCX, XLSX, PPTX, CSV, TXT)
3. Develop an intelligent search system with real-time highlighting
4. Ensure responsive design for all device sizes
5. Optimize performance for large document processing

## ✨ Features
- **PDF Files** - View and search PDF documents with OCR text extraction
- **Microsoft Word (.docx)** - Read and search DOCX files with formatted text
- **Microsoft Excel (.xlsx, .xls)** - View spreadsheets with multiple sheets support
- **Microsoft PowerPoint (.pptx)** - Display slides with extracted text content
- **CSV Files** - Render CSV data in clean, formatted tables
- **Text Files (.txt)** - View plain text documents

### Core Functionality
- 🔍 **Intelligent Search** - Real-time keyword and phrase search across all document types
- 📊 **Result Counter** - Shows the number of matches found for your search query
- 🎨 **Syntax Highlighting** - Search results are highlighted with visual markers
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌓 **Dark Mode** - Toggle between light and dark themes with persistent preferences
- 🖱️ **Drag & Drop** - Easy file upload via drag-and-drop or file selection
- ⚡ **Fast Processing** - Optimized file handling and rendering

### User Interface
- Clean, modern gradient design
- Smooth animations and transitions
- Sticky navigation bar
- Multi-page navigation (Home, Documents, About)
- Help modal with contact information
- Processing status indicators

## 🎓 Academic Learning Outcomes

Through this project, the following concepts were learned and implemented:

### Technical Skills
- **React Fundamentals**: Components, State Management, Hooks (useState, useEffect, useRef)
- **File Processing**: ArrayBuffer, Blob API, File Reader API
- **Asynchronous Programming**: Promises, async/await, error handling
- **DOM Manipulation**: Dynamic content rendering, text highlighting
- **CSS Styling**: Flexbox, Grid, Animations, Responsive Design
- **Build Tools**: Vite configuration, optimization, and bundling

### Libraries & APIs Used
- **PDF.js**: For PDF rendering and text extraction
- **Mammoth.js**: For DOCX to HTML conversion
- **SheetJS (xlsx)**: For Excel file parsing
- **JSZip**: For PowerPoint file extraction
- **React DOM**: For virtual DOM management

### Software Engineering Practices
- Component-based architecture
- Code reusability and modularity
- Error handling and user feedback
- Performance optimization
- Version control with Git
- Documentation and code comments

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         User Interface (React)          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Navigation│  │File Upload│  │Viewer  ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      File Processing Layer              │
│  ┌─────────┐ ┌─────────┐ ┌────────────┐│
│  │PDF.js   │ │Mammoth  │ │SheetJS     ││
│  └─────────┘ └─────────┘ └────────────┘│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│     Search & Rendering Engine           │
│  • Text Extraction                      │
│  • Regex-based Search                   │
│  • Highlight Generation                 │
└─────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or later recommended)
- npm (v8.0.0 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/document-reader.git
   cd document-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages listed in `package.json`

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📦 Project Structure

```
document-reader/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── About.jsx           # About page component
│   │   ├── FileUpload.jsx      # File upload with drag-and-drop
│   │   ├── FileViewer.jsx      # Document rendering component
│   │   ├── ProcessingStatus.jsx # Loading indicator
│   │   └── SearchBox.jsx       # Search functionality
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── styles.css             # Global styles
├── Dockerfile                  # Docker configuration
├── .dockerignore              # Docker ignore rules
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── eslint.config.js          # ESLint configuration
```

## 🛠️ Technologies Used

### Frontend Framework
- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.1.7** - Fast build tool and dev server

### Document Processing Libraries
- **pdfjs-dist 3.11.174** - PDF rendering and text extraction
- **mammoth 1.11.0** - DOCX to HTML conversion
- **xlsx 0.18.5** - Excel file parsing
- **jszip 3.10.1** - PowerPoint (PPTX) file extraction

### Development Tools
- **ESLint 9.36.0** - Code linting
- **@vitejs/plugin-react 5.0.4** - React plugin for Vite

## 🎯 Usage Guide

### Uploading Documents

1. **Click Upload Area** - Click on the upload area or the file input button
2. **Drag & Drop** - Drag a file directly onto the upload area
3. **Supported Formats** - PDF, DOCX, XLSX, XLS, PPTX, TXT, CSV

### Searching Documents

1. Enter your search term in the search box
2. Press Enter or click the Search button
3. Results are highlighted in yellow throughout the document
4. Match count is displayed below the search box

### Navigation

- **Home** - Upload and view documents
- **Documents** - Coming soon features (cloud storage, collaboration)
- **About** - Learn more about DocReader

### Theme Toggle

Click the theme button in the navigation bar to switch between light and dark modes. Your preference is saved automatically.

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t docreader .
```

### Run Docker Container

```bash
docker run -p 80:80 docreader
```

The application will be available at `http://localhost`

### Docker Configuration

The included `Dockerfile` uses a two-stage build:
1. **Build stage** - Compiles the React application
2. **Production stage** - Serves static files with Nginx

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)

The `vite.config.js` includes:
- React plugin configuration
- PDF.js worker optimization
- Environment variable definitions
- Build optimization settings

### ESLint Configuration (`eslint.config.js`)

Code quality is maintained with ESLint rules for:
- React hooks best practices
- React refresh patterns
- Modern JavaScript (ES6+) standards
- Unused variable detection

## 📸 Screenshots

### Home Page - Light Mode
![Home Page Light](./screenshots/home-light.png)

### Document Viewer with Search
![Document Viewer](./screenshots/viewer-search.png)

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)

### About Page
![About Page](./screenshots/about-page.png)

*Note: Add actual screenshots to a `screenshots` folder in your repository*

## 🎥 Demo Video

[Link to Demo Video] - *Add your demonstration video link here*

## 📊 Project Statistics

- **Total Components**: 5 main components + 1 main App component
- **Supported File Formats**: 6 (PDF, DOCX, XLSX, PPTX, CSV, TXT)
- **External Libraries**: 4 major (pdfjs-dist, mammoth, xlsx, jszip)
- **Lines of Code**: ~1500+ (excluding node_modules)
- **Development Time**: [Your development time]

## 📄 File Processing Details

### PDF Files
- Renders using PDF.js
- Extracts text content for searching
- Generates thumbnail previews for each page
- Displays in an embedded iframe viewer

### DOCX Files
- Converts to HTML using Mammoth
- Preserves formatting and styles
- Extracts plain text for search functionality

### Excel Files
- Parses all sheets in the workbook
- Displays data in HTML tables
- Supports searching across all cells
- Handles both .xlsx and .xls formats

### PowerPoint Files
- Extracts slides from .pptx files
- Retrieves text content from each slide
- Displays slides with titles
- Enables text search across presentations

### CSV Files
- Parses comma-separated values
- Renders in formatted tables
- Filters empty rows and cells
- Supports search within cells

## 🎨 Styling Features

- **Gradient Backgrounds** - Modern purple gradient theme
- **Glass Morphism** - Frosted glass effects on cards
- **Smooth Animations** - CSS transitions and transforms
- **Custom Scrollbars** - Styled scrollbars matching the theme
- **Responsive Grid** - Flexible layouts for all screen sizes
- **Hover Effects** - Interactive element feedback

## 🔒 Security Considerations

- No server-side processing - all operations happen in the browser
- Files are not uploaded to any external server
- Local storage used only for theme preferences
- No third-party analytics or tracking

## 🚧 Future Enhancements

### Planned Features
- ☁️ **Cloud Storage Integration** - Save documents to cloud services
- 🤝 **Collaboration Tools** - Real-time document sharing and commenting
- 🔍 **Advanced Search** - Fuzzy search, filters, and search history
- 🏷️ **Document Tagging** - Organize documents with custom tags
- 📊 **Analytics Dashboard** - Track document views and search patterns
- 🔐 **User Authentication** - Secure login and user profiles
- 📱 **Mobile App** - Native mobile application
- 🌐 **Multi-language Support** - Internationalization (i18n)
- 🎨 **Custom Themes** - User-customizable color schemes
- 📤 **Export Options** - Export search results and annotations

### Known Limitations
- Maximum file size recommended: 50MB
- Large PDF files may take time to process
- Some complex Excel formulas may not render perfectly
- PowerPoint animations are not preserved

## 💡 Challenges Faced & Solutions

### Challenge 1: PDF Text Extraction
**Problem**: Extracting text from PDF while maintaining structure  
**Solution**: Used PDF.js's `getTextContent()` method with viewport scaling

### Challenge 2: DOCX Formatting
**Problem**: Preserving Word document formatting in browser  
**Solution**: Implemented Mammoth.js for HTML conversion with CSS styling

### Challenge 3: Search Performance
**Problem**: Slow search on large documents  
**Solution**: Optimized regex patterns and implemented debouncing

### Challenge 4: Multiple File Format Support
**Problem**: Different libraries for each format increased complexity  
**Solution**: Created unified file processing layer with modular architecture

### Challenge 5: Responsive Design
**Problem**: Layout breaking on mobile devices  
**Solution**: Used CSS Grid and Flexbox with media queries

## 🐛 Troubleshooting

### Common Issues

**Issue 1: PDF Worker Error**
```
Error: Setting up fake worker failed
```
**Solution**: 
- Ensure `pdfjs-dist` is properly installed: `npm install pdfjs-dist`
- Check that the worker URL is correctly configured in `FileUpload.jsx`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Issue 2: File Not Processing**
```
Error processing file
```
**Solution**:
- Verify the file format is supported (PDF, DOCX, XLSX, PPTX, CSV, TXT)
- Check browser console (F12) for detailed error messages
- Ensure file size is reasonable (under 50MB recommended)
- Try with a different file to rule out file corruption

**Issue 3: Search Not Working**
**Solution**:
- Confirm document has been fully processed (wait for loading to complete)
- Check that text content was successfully extracted
- Verify search query is not empty
- Try refreshing the page (F5)

**Issue 4: Vite Server Not Starting**
```
Port 5173 is already in use
```
**Solution**:
- Kill the process using the port or use a different port:
  ```bash
  npm run dev -- --port 3000
  ```

**Issue 5: Module Not Found**
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check if all dependencies are listed in `package.json`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Upload PDF file and verify rendering
- [ ] Upload DOCX file and check formatting
- [ ] Upload XLSX file with multiple sheets
- [ ] Upload PPTX file and view slides
- [ ] Upload CSV file and verify table display
- [ ] Upload TXT file
- [ ] Perform search on each file type
- [ ] Verify search result count
- [ ] Test highlight functionality
- [ ] Check responsive design on mobile
- [ ] Test dark mode toggle
- [ ] Verify navigation between pages
- [ ] Test drag-and-drop file upload

### Test Cases

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| PDF Upload | sample.pdf | PDF viewer displays | ✅ Pass |
| Text Search | "lorem" in document | Highlights all matches | ✅ Pass |
| Invalid File | .exe file | Error message | ✅ Pass |
| Empty Search | "" | No highlighting | ✅ Pass |
| Large File | 100MB PDF | Loading indicator | ⚠️ Slow |
| Dark Mode | Toggle button | Theme changes | ✅ Pass |

## 📝 License

This project is submitted as part of academic curriculum and is for educational purposes only.

## 🎓 Project Contributors

**Student Name**: [Your Name]  
**Roll Number**: [Your Roll Number]  
**Course**: [Your Course Name]  
**College**: [Your College Name]  
**Academic Year**: [Year]  
**Submitted To**: [Professor/Guide Name]

## 📧 Contact

For any queries regarding this project:
- **Email**: [Your Email]
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- **Project Guide**: [Guide Name] - For valuable guidance and support
- **College**: [College Name] - For providing resources and infrastructure
- **Open Source Community**: For the excellent libraries used in this project
  - PDF.js by Mozilla
  - Mammoth.js for DOCX processing
  - SheetJS for Excel handling
  - React Team for the framework

## 📖 References

1. React Official Documentation - https://react.dev/
2. PDF.js Documentation - https://mozilla.github.io/pdf.js/
3. Mammoth.js Documentation - https://github.com/mwilliamson/mammoth.js
4. SheetJS Documentation - https://docs.sheetjs.com/
5. MDN Web Docs - https://developer.mozilla.org/

---

**Built with React, styled with love, and powered by simplicity.** 💡

**Submitted as College Project - [Year]**

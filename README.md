# 📁 DocReader - Document Reader & Search

A modern, feature-rich web application for uploading, viewing, and searching through various document formats with speed and simplicity. Built with React and optimized for performance.

![DocReader](https://img.shields.io/badge/React-19.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)

## ✨ Features

### Document Support
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or later recommended)
- npm (v8.0.0 or later)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

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

### Vite Configuration

The `vite.config.js` includes:
- React plugin configuration
- PDF.js worker optimization
- Environment variable definitions

### ESLint Configuration

Code quality is maintained with ESLint rules for:
- React hooks best practices
- React refresh patterns
- Modern JavaScript standards

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

## 🚧 Roadmap

### Planned Features (Documents Page)
- ☁️ **Cloud Storage** - Save and organize documents online
- 🤝 **Team Collaboration** - Share documents and collaborate in real-time
- 🔍 **Advanced Search** - AI-powered search across multiple files
- 🏷️ **Smart Tagging** - Automatic document categorization
- 📊 **Analytics** - Document usage statistics

## 🐛 Troubleshooting

### Common Issues

**PDF Worker Error**
- Ensure `pdfjs-dist` is properly installed
- Check that the worker URL is correctly configured in `FileUpload.jsx`

**File Not Processing**
- Verify the file format is supported
- Check browser console for error messages
- Ensure file size is reasonable (under 50MB recommended)

**Search Not Working**
- Confirm document has been fully processed
- Check that text content was successfully extracted
- Try refreshing the page

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow the existing code style
2. Use ESLint to check your code
3. Test all document types before submitting
4. Update documentation for new features

## 📞 Support

For questions, issues, or support:
- **Email**: support@docreader.com
- **Phone**: +1 (800) 555-1234

## 🙏 Acknowledgments

- **PDF.js** - Mozilla's PDF rendering library
- **Mammoth.js** - DOCX conversion library
- **SheetJS** - Excel file parsing library
- **React Team** - For the amazing framework

---

**Built with React, styled with love, and powered by simplicity.** 💡

Made with ❤️ by the DocReader Team

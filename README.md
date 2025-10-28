# Document Search with OCR

A full-stack MERN application for uploading documents (PDFs and images), performing OCR (Optical Character Recognition) using Tesseract.js, and searching through extracted text with real-time progress tracking.

## 🚀 Features

### Core Functionality
- ✅ **Document Upload**: Upload PDFs and images with validation, duplicate detection (SHA-256 hash)
- ✅ **OCR Processing**: Extract text from documents using Tesseract.js with multi-language support
- ✅ **Full-Text Search**: MongoDB text search with highlighting, snippets, and pagination
- ✅ **Real-time Progress**: WebSocket-based live updates for OCR progress
- ✅ **Quality Assessment**: Confidence scoring and quality flags for OCR results
- ✅ **Multi-page Support**: Handle multi-page PDFs with per-page processing

### Advanced Features
- 🔧 **Image Preprocessing**: Grayscale, contrast, sharpen, binarize, denoise, rotate
- 🌍 **Language Support**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and more
- ⚙️ **Job Queue**: Asynchronous processing with BullMQ and Redis
- 🔍 **Word-level Data**: Extract word positions and bounding boxes
- 🔄 **Retry Mechanism**: Retry failed OCR jobs with different parameters
- 🎯 **Search Filters**: Filter by tags, dates, document type
- 🔐 **Authentication**: JWT-based user authentication

## 📋 Tech Stack

### Backend
- **Node.js** + Express.js
- **MongoDB** with Mongoose
- **Redis** for job queue
- **BullMQ** for async processing
- **Tesseract.js** for OCR
- **Sharp** for image preprocessing
- **Socket.IO** for real-time updates
- **Poppler** (pdftoppm) for PDF conversion

### Frontend
- **React** 18
- **React Router** v6
- **Axios** for API calls
- **Socket.IO Client** for WebSocket
- Modern CSS styling

### Infrastructure
- **Docker** & Docker Compose
- Multi-container architecture

## 📁 Project Structure

```
ocr-document-search/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic (OCR, preprocessing)
│   │   ├── utils/            # Helper functions
│   │   ├── worker/           # Background job worker
│   │   ├── queue/            # BullMQ setup
│   │   ├── app.js           # Express app
│   │   ├── index.js         # Entry point
│   │   └── config.js        # Configuration
│   ├── .env                 # Environment variables
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx         # Main app
│   │   ├── index.jsx       # Entry point
│   │   └── index.css       # Global styles
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (or Docker + Docker Compose)
- At least 4GB RAM
- 10GB free disk space

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ocr-document-search
```

2. **Create directories**
```bash
mkdir -p data/uploads
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Wait for services** (30-60 seconds)
```bash
docker-compose ps
```

All services should show "Up" status.

5. **Access the application**
- Frontend: **http://localhost:3000**
- Backend API: **http://localhost:4000**
- Health Check: **http://localhost:4000/health**

## 📖 Usage Guide

### Uploading Documents

1. Open http://localhost:3000
2. Click on "Upload" tab
3. Select a PDF or image file
4. Choose language (default: English)
5. Select preprocessing preset (default: Document)
6. Click "Upload & Process"
7. Monitor real-time progress!

### Searching Documents

1. Wait for OCR to complete
2. Click on "Search" tab
3. Enter search terms
4. View results with highlighted text
5. Click a result to see full document pages

### Supported File Types
- **PDFs**: Multi-page documents
- **Images**: PNG, JPG, JPEG, TIFF, BMP
- **Max Size**: 100MB (configurable)

### Supported Languages
- English (eng)
- French (fra)
- German (deu)
- Spanish (spa)
- Italian (ita)
- Portuguese (por)
- Russian (rus)
- Arabic (ara)
- Chinese Simplified (chi_sim)
- Japanese (jpn)
- Korean (kor)
- Hindi (hin)

## 🔧 Configuration

### Environment Variables

Edit `backend/.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://mongo:27017/ocr-db

# Redis
REDIS_URL=redis://redis:6379

# Security
JWT_SECRET=your-secret-key-change-in-production

# Storage
UPLOAD_DIR=/data/uploads
MAX_FILE_SIZE=104857600  # 100MB

# Worker
WORKER_CONCURRENCY=2
```

### Preprocessing Presets

**Document** (Default):
- Grayscale: Yes
- Contrast enhancement: Yes
- Sharpen: Yes
- Binarization: No
- DPI: 300

**Scan** (High Quality):
- All document features +
- Binarization: Yes
- Denoise: Yes
- Threshold: 140

**Low Quality** (Faded/Poor Scans):
- All scan features +
- Aggressive binarization
- Threshold: 120
- DPI: 400

## 🛠️ Development

### Run Backend Locally

```bash
cd backend
npm install
npm run dev       # API server
npm run worker    # OCR worker (separate terminal)
```

### Run Frontend Locally

```bash
cd frontend
npm install
npm start
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f mongo
docker-compose logs -f redis
```

### Rebuild After Changes

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

## 📡 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Upload

#### Upload Document
```http
POST /api/upload
Content-Type: multipart/form-data

file: <binary>
languages: "eng" (optional)
preprocess: {"preset": "scan"} (optional)
```

### Search

#### Search Documents
```http
GET /api/search?q=invoice&page=1&size=10&tags=finance&fromDate=2024-01-01
```

### Jobs

#### Get Job Status
```http
GET /api/jobs/document/:documentId
```

#### List All Jobs
```http
GET /api/jobs?page=1&size=20&status=done
```

#### Retry Failed Job
```http
POST /api/jobs/:jobId/retry
```

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check port conflicts
docker ps

# Check logs
docker-compose logs

# Restart specific service
docker-compose restart backend
```

### OCR Not Processing

```bash
# Verify worker is running
docker-compose ps worker

# Check worker logs
docker-compose logs -f worker

# Restart worker
docker-compose restart worker
```

### Upload Fails

1. Check file size (max 100MB)
2. Verify supported format
3. Check backend logs:
   ```bash
   docker-compose logs -f backend
   ```

### Search Returns No Results

1. Verify document status is "done"
2. Wait a few seconds for indexing
3. Try broader search terms
4. Check MongoDB connection

### Low OCR Accuracy

1. Try different preprocessing presets
2. Verify correct language selected
3. Check image quality/resolution
4. Use "Low Quality" preset for faded scans

## 🏗️ Architecture

### OCR Pipeline Flow

```
1. Upload File → 2. Validate → 3. Hash Check → 4. Save to Disk
                                     ↓
5. Create DB Record → 6. Queue Job → 7. Worker Processes
                                     ↓
8. PDF to Images → 9. Preprocess → 10. Run OCR
                                     ↓
11. Extract Text/Words → 12. Save to DB → 13. Emit WebSocket Updates
```

### Data Models

**Document**:
- title, filename, mimetype, size
- fileHash (SHA-256 for duplicates)
- ocrState: queued | processing | done | failed
- pages[] with text, words, confidence, bounding boxes

**OCRJob**:
- document reference
- status, progress, error
- timestamps

**User**:
- email, password (hashed)
- name, role

## 📊 Performance

- **Concurrent Processing**: 2 workers (configurable)
- **Queue Management**: BullMQ with Redis
- **Database Indexing**: MongoDB text index on pages.text, title, tags
- **File Deduplication**: SHA-256 hash checking
- **Real-time Updates**: Socket.IO for progress tracking

## 🔒 Security

- JWT authentication
- Password hashing (SHA-256 - use bcrypt in production)
- Input validation
- File type validation
- File size limits
- CORS configuration
- SQL/NoSQL injection prevention

## 🚀 Production Deployment

### Recommendations

1. **Change JWT_SECRET** to a strong random value
2. **Enable MongoDB authentication**
3. **Use HTTPS/SSL**
4. **Set up proper logging** (Winston, Pino)
5. **Configure backups** for MongoDB
6. **Use cloud storage** (S3, GCS) for uploads
7. **Set up monitoring** (health checks, alerts)
8. **Add rate limiting**
9. **Use bcrypt** for password hashing
10. **Environment-specific configs**

### Docker Production Build

```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
cd backend
npm test
```

## 📈 Future Enhancements

- [ ] Batch upload
- [ ] Advanced search (boolean operators, fuzzy matching)
- [ ] Document comparison
- [ ] Export to PDF/Word/Text
- [ ] Custom OCR models
- [ ] Collaborative annotations
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Cloud storage integration
- [ ] Webhooks for job completion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Documentation**: This README
- **Email**: support@example.com

## 🙏 Credits

Built with:
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [BullMQ](https://docs.bullmq.io/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://react.dev/)

---

**Made with ❤️ using the MERN Stack**

# FundingIntel Backend API

Backend server for the FundingIntel platform, providing translation services using Google Cloud Translation API.

## 🚀 Features

- **Translation API**: Translate text between 8+ languages
- **Batch Translation**: Translate multiple texts efficiently in a single API call
- **Language Detection**: Automatically detect the language of input text
- **Document Search API**: Vector-based semantic search in government funding documents
- **PDF Processing**: Extract and process text from PDF documents
- **Vector Embeddings**: Generate embeddings locally using Xenova Transformers (no API key needed!)
- **FAISS Vector Store**: Fast similarity search with FAISS
- **Error Handling**: Comprehensive error messages shown in terminal
- **Success Logging**: Language change success messages in terminal
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)
- Google Cloud Platform account with Translation API enabled (optional - for translation features)
- Google Translate API Key (optional - for translation features)

## 🛠️ Installation

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install the following packages:
- **express**: Web framework for Node.js
- **cors**: Enable Cross-Origin Resource Sharing
- **dotenv**: Load environment variables from .env file
- **axios**: HTTP client for making API requests
- **pdf-parse**: Extract text from PDF files
- **@xenova/transformers**: Local transformer models for embeddings (no API key needed!)
- **faiss-node**: FAISS vector similarity search library

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Google Translate API key (optional - only needed for translation features):

```env
PORT=3000
GOOGLE_TRANSLATE_API_KEY=your_actual_api_key_here
```

**Note:** Document search with vector embeddings now works completely locally using `@xenova/transformers`. No API keys are required for the document search functionality!

## 🔑 Getting Google Translate API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "FundingIntel")
4. Click "Create"

### Step 2: Enable Cloud Translation API
1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Cloud Translation API"
3. Click on it and click "Enable"

### Step 3: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Your API key will be created
4. **Important:** Click "Restrict Key" for security:
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Translation API"
   - Click "Save"

### Step 4: Add to .env
Copy your API key and add it to the `.env` file:
```env
GOOGLE_TRANSLATE_API_KEY=AIza...your-key-here
```

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## 📡 API Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running

**Response:**
```json
{
  "status": "healthy",
  "message": "FundingIntel Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Translate Text

**Endpoint:** `POST /api/translate`

**Description:** Translate text from one language to another

**Request Body:**
```json
{
  "text": "Hello, how are you?",
  "targetLanguage": "hi",
  "sourceLanguage": "en"
}
```

**Response (Success):**
```json
{
  "success": true,
  "translatedText": "नमस्ते, आप कैसे हैं?"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "API key not configured"
}
```

### 3. Batch Translation

**Endpoint:** `POST /api/translate/batch`

**Description:** Translate multiple texts at once

**Request Body:**
```json
{
  "texts": ["Hello", "Good morning", "Thank you"],
  "targetLanguage": "hi",
  "sourceLanguage": "en"
}
```

**Response (Success):**
```json
{
  "success": true,
  "translations": ["नमस्ते", "शुभ प्रभात", "धन्यवाद"]
}
```

### 4. Detect Language

**Endpoint:** `POST /api/translate/detect`

**Description:** Detect the language of input text

**Request Body:**
```json
{
  "text": "नमस्ते"
}
```

**Response (Success):**
```json
{
  "success": true,
  "language": "hi",
  "confidence": 0.98
}
```

### 5. Initialize Vector Store

**Endpoint:** `POST /api/documents/initialize`

**Description:** Initialize the vector store by processing PDFs and generating embeddings

**Request Body:** None

**Response (Success):**
```json
{
  "success": true,
  "message": "Vector store initialized",
  "documentsCount": 10,
  "dimension": 768
}
```

**Note:** This endpoint is automatically called when the server starts if the vector store is not initialized.

### 6. Search Documents

**Endpoint:** `POST /api/documents/search`

**Description:** Search for relevant document sections using semantic vector search

**Request Body:**
```json
{
  "query": "What is the Startup India Seed Fund Scheme?",
  "topK": 5
}
```

**Response (Success):**
```json
{
  "success": true,
  "query": "What is the Startup India Seed Fund Scheme?",
  "results": [
    {
      "content": "The Startup India Seed Fund Scheme provides financial assistance to startups...",
      "metadata": {
        "source": "Startup India Seed Fund Scheme",
        "chunkIndex": 0,
        "totalChunks": 9
      },
      "distance": 0.234,
      "relevanceScore": 0.81
    }
  ],
  "count": 5
}
```

**Response (Not Initialized):**
```json
{
  "success": false,
  "error": "Vector store not initialized. Please initialize first.",
  "needsInitialization": true
}
```

### 7. Vector Store Status

**Endpoint:** `GET /api/documents/status`

**Description:** Check the status of the vector store

**Response:**
```json
{
  "success": true,
  "initialized": true,
  "documentsCount": 10,
  "hasFAISSIndex": true
}
```

## 🌍 Supported Languages

The translation API supports the following language codes:

- **en**: English (US)
- **hi**: Hindi (हिंदी)
- **ta**: Tamil (தமிழ்)
- **te**: Telugu (తెలుగు)
- **bn**: Bengali (বাংলা)
- **mr**: Marathi (मराठी)
- **gu**: Gujarati (ગુજરાતી)
- **kn**: Kannada (ಕನ್ನಡ)

## 📝 Terminal Logs

The backend provides comprehensive terminal logging:

### Success Messages
```
✅ Health check successful
✅ Translation successful: "Hello..." → "नमस्ते..."
✅ Batch translation successful: 3 texts translated
✅ Language detected: hi (confidence: 0.98)
✅ Google Translate API key configured
```

### Error Messages
```
❌ ERROR: Google Translate API key not configured
❌ ERROR: Missing required field: text
❌ ERROR: Translation failed - Invalid API key
❌ ERROR: Unexpected error in /translate: ...
⚠️  WARNING: Google Translate API key not configured!
⚠️  404 Not Found: GET /unknown-endpoint
```

### Request Logs
```
[2024-01-01T00:00:00.000Z] POST /api/translate
[2024-01-01T00:00:01.000Z] POST /api/translate/batch
[2024-01-01T00:00:02.000Z] POST /api/translate/detect
[2024-01-01T00:00:03.000Z] POST /api/documents/initialize
[2024-01-01T00:00:04.000Z] POST /api/documents/search
```

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Translate text
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","targetLanguage":"hi","sourceLanguage":"en"}'

# Batch translate
curl -X POST http://localhost:3000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts":["Hello","World"],"targetLanguage":"hi","sourceLanguage":"en"}'

# Detect language
curl -X POST http://localhost:3000/api/translate/detect \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते"}'

# Initialize vector store
curl -X POST http://localhost:3000/api/documents/initialize

# Check vector store status
curl http://localhost:3000/api/documents/status

# Search documents
curl -X POST http://localhost:3000/api/documents/search \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the Startup India Seed Fund Scheme?","topK":5}'
```

### Using the Test Script

A test script is provided to quickly test all API endpoints:

```bash
# Make sure the server is running in another terminal
cd backend
npm start

# In a new terminal, run the test script
cd backend
./test-api.sh
```

The test script will:
- ✅ Check server health
- ✅ Test translation endpoints
- ✅ Test validation errors
- ✅ Display responses in formatted JSON

Check the backend server terminal to see the detailed logs with emojis and colored output!

## 🔧 Troubleshooting

### Issue: "API key not configured" error

**Solution:** Make sure you have:
1. Created a `.env` file in the backend directory
2. Added your Google Translate API key: `GOOGLE_TRANSLATE_API_KEY=your_key`
3. Restarted the server after adding the key

### Issue: "Translation failed - Invalid API key" error

**Solution:**
1. Verify your API key is correct in the `.env` file
2. Check that the Cloud Translation API is enabled in Google Cloud Console
3. Ensure your API key has proper restrictions (only Translation API)

### Issue: Port already in use

**Solution:** Change the port in `.env`:
```env
PORT=3001
```

### Issue: CORS errors from frontend

**Solution:** The backend has CORS enabled by default. Make sure:
1. The backend server is running
2. Frontend is making requests to the correct URL (e.g., `http://localhost:3000/api/translate`)

## 📁 Project Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── translationService.js   # Translation logic
│   │   ├── pdfService.js           # PDF text extraction and chunking
│   │   └── vectorStoreService.js   # Vector embeddings and FAISS search
│   ├── routes/
│   │   ├── translationRoutes.js    # Translation API route handlers
│   │   └── documentRoutes.js       # Document search API route handlers
│   └── server.js                   # Main server file
├── .env.example                    # Example environment variables
├── .env                           # Your environment variables (create this)
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## 🔒 Security Best Practices

- ✅ Never commit `.env` file to version control
- ✅ Use API key restrictions in Google Cloud Console
- ✅ Set up usage quotas to prevent abuse
- ✅ Rotate API keys regularly
- ✅ Use environment variables for sensitive data
- ✅ Implement rate limiting in production
- ✅ Monitor API usage in Google Cloud Console

## 📊 API Usage & Billing

- Google Cloud Translation API offers a **free tier**: 500,000 characters/month
- After free tier: $20 per 1M characters
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges

## 🚀 Production Deployment

For production deployment:

1. Set up a production server (AWS, Google Cloud, Heroku, etc.)
2. Install Node.js on the server
3. Clone the repository and install dependencies
4. Set environment variables on the server
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name fundingintel-backend
   ```
6. Set up a reverse proxy (nginx) for better security
7. Enable HTTPS with SSL certificates
8. Set up monitoring and logging

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Author

**Punith Sai** - [punithsai18](https://github.com/punithsai18)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for the Indian startup ecosystem

# Backend API Testing Guide

This guide explains how to test the FundingIntel Backend Translation API and understand its request/response behavior.

## Overview

The backend provides a REST API for translating text using Google Cloud Translation API. It includes comprehensive logging that prints success and failure messages to help you debug and understand API behavior.

## Server Status

When you start the server with `npm start`, you'll see:

```
============================================================
🚀 FundingIntel Backend API Server Started
============================================================
📡 Server running on: http://localhost:3000
🏥 Health check: http://localhost:3000/health
🌐 Translation API: http://localhost:3000/api/translate
============================================================

⚠️  WARNING: Google Translate API key not configured!
   Please set GOOGLE_TRANSLATE_API_KEY in .env file
   Translation features will not work without it.

📝 Logs will appear here...
```

## Testing the API

### Quick Test (Using Provided Script)

Run the comprehensive test script:
```bash
cd backend
./test-backend-comprehensive.sh
```

This will test all endpoints and show you success/failure messages for each test case.

### Manual Testing (Using curl)

#### 1. Health Check

**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "FundingIntel Backend API is running",
  "timestamp": "2025-12-28T05:57:30.610Z"
}
```

**Server Log:**
```
[2025-12-28T05:57:30.610Z] GET /health
✅ Health check successful
```

#### 2. Translate Text (Without API Key)

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"hi","sourceLanguage":"en"}'
```

**Response:**
```json
{
  "success": false,
  "error": "API key not configured"
}
```

**Server Log:**
```
[2025-12-28T05:57:30.619Z] POST /api/translate
❌ ERROR: Google Translate API key not configured
```

#### 3. Translate Text (With API Key)

First, add your API key to `.env`:
```env
GOOGLE_TRANSLATE_API_KEY=your_actual_key_here
```

Restart the server, then:

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"hi","sourceLanguage":"en"}'
```

**Response (Success):**
```json
{
  "success": true,
  "translatedText": "नमस्ते दुनिया"
}
```

**Server Log:**
```
[2025-12-28T05:57:30.619Z] POST /api/translate
🔄 Translating text from en to hi...
✅ Translation successful: "Hello World" → "नमस्ते दुनिया"
```

#### 4. Translate Text (No Translation Needed)

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"en","sourceLanguage":"en"}'
```

**Response:**
```json
{
  "success": true,
  "translatedText": "Hello World"
}
```

**Server Log:**
```
[2025-12-28T05:57:30.643Z] POST /api/translate
✅ No translation needed (target: en, source: en)
```

#### 5. Batch Translation

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts":["Hello","World","Test"],"targetLanguage":"hi","sourceLanguage":"en"}'
```

**Response (With API Key):**
```json
{
  "success": true,
  "translations": ["नमस्ते", "दुनिया", "परीक्षण"]
}
```

**Server Log:**
```
[2025-12-28T05:57:30.651Z] POST /api/translate/batch
🔄 Batch translating 3 texts from en to hi...
✅ Batch translation successful: 3 texts translated
```

#### 6. Language Detection

**Request:**
```bash
curl -X POST http://localhost:3000/api/translate/detect \
  -H "Content-Type: application/json" \
  -d '{"text":"नमस्ते"}'
```

**Response (With API Key):**
```json
{
  "success": true,
  "language": "hi",
  "confidence": 0.98
}
```

**Server Log:**
```
[2025-12-28T05:57:30.666Z] POST /api/translate/detect
🔍 Detecting language for text: "नमस्ते"
✅ Language detected: hi (confidence: 0.98)
```

## Error Handling

The API provides clear error messages for common issues:

### Missing Required Fields

**Missing `text` field:**
```json
{
  "success": false,
  "error": "Missing required field: text"
}
```

**Server Log:**
```
❌ ERROR: Missing required field: text
```

**Missing `targetLanguage` field:**
```json
{
  "success": false,
  "error": "Missing required field: targetLanguage"
}
```

**Server Log:**
```
❌ ERROR: Missing required field: targetLanguage
```

### Invalid Fields

**Invalid `texts` array for batch translation:**
```json
{
  "success": false,
  "error": "Missing or invalid field: texts (must be an array)"
}
```

**Server Log:**
```
❌ ERROR: Missing or invalid field: texts (must be an array)
```

### API Errors

**Invalid API Key:**
```json
{
  "success": false,
  "error": "API_KEY_INVALID"
}
```

**Server Log:**
```
❌ ERROR: Translation failed - API_KEY_INVALID
```

### 404 Not Found

**Request to invalid endpoint:**
```json
{
  "success": false,
  "error": "Endpoint not found"
}
```

**Server Log:**
```
⚠️  404 Not Found: GET /api/invalid
```

## Understanding Server Logs

The backend provides comprehensive logging with emojis for easy identification:

| Symbol | Meaning | Example |
|--------|---------|---------|
| ✅ | Success | `✅ Translation successful` |
| ❌ | Error | `❌ ERROR: API key not configured` |
| ⚠️ | Warning | `⚠️  WARNING: API key not configured!` |
| 🔄 | Processing | `🔄 Translating text from en to hi...` |
| 🔍 | Detecting | `🔍 Detecting language for text` |
| 📡 | Server Info | `📡 Server running on: http://localhost:3000` |
| 📝 | Logs Header | `📝 Logs will appear here...` |
| 🚀 | Server Start | `🚀 FundingIntel Backend API Server Started` |

## Success Criteria

When testing the backend, you should verify:

1. **Server starts successfully** - Shows startup banner with server URL
2. **Health check works** - Returns healthy status
3. **API key warning shown** - When .env doesn't have API key
4. **Validation works** - Returns 400 errors for missing fields
5. **Error handling works** - Returns clear error messages when API key missing
6. **No-translation cases work** - Returns original text when source = target
7. **All logs print correctly** - Success (✅) and error (❌) messages appear
8. **404 handling works** - Invalid endpoints return proper 404 response

## Example Test Session

Here's what a complete test session looks like:

**Terminal 1 (Backend Server):**
```bash
cd backend
npm start
```

**Terminal 2 (Testing):**
```bash
cd backend
./test-backend-comprehensive.sh
```

**Expected Output in Terminal 1:**
```
============================================================
🚀 FundingIntel Backend API Server Started
============================================================
📡 Server running on: http://localhost:3000
🏥 Health check: http://localhost:3000/health
🌐 Translation API: http://localhost:3000/api/translate
============================================================

⚠️  WARNING: Google Translate API key not configured!
   Please set GOOGLE_TRANSLATE_API_KEY in .env file
   Translation features will not work without it.

📝 Logs will appear here...

[2025-12-28T05:57:30.610Z] GET /health
✅ Health check successful
[2025-12-28T05:57:30.619Z] POST /api/translate
❌ ERROR: Google Translate API key not configured
[2025-12-28T05:57:30.627Z] POST /api/translate
❌ ERROR: Missing required field: text
... (more logs)
```

**Expected Output in Terminal 2:**
```
============================================================
FundingIntel Backend Translation API - Comprehensive Test
============================================================

✅ Server is running

✨ Test 1: Health Check
{
  "status": "healthy",
  "message": "FundingIntel Backend API is running"
}
... (test results)

✅ All tests completed successfully!
```

## Testing with Real Google API

To test with actual Google Translation API:

1. **Get API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Cloud Translation API"
   - Create API Key

2. **Configure:**
   ```bash
   cd backend
   echo "GOOGLE_TRANSLATE_API_KEY=your_actual_key_here" >> .env
   ```

3. **Restart Server:**
   ```bash
   npm start
   ```

4. **Test Translation:**
   ```bash
   curl -X POST http://localhost:3000/api/translate \
     -H "Content-Type: application/json" \
     -d '{"text":"Hello World","targetLanguage":"hi"}'
   ```

5. **Verify Success:**
   - Response should show: `"success": true`
   - Server log should show: `✅ Translation successful`
   - Translated text should be in Hindi

## Supported Languages

The Google Cloud Translation API supports 100+ languages. The FundingIntel platform focuses on these key Indian languages:

- `en` - English
- `hi` - Hindi (हिंदी)
- `ta` - Tamil (தமிழ்)
- `te` - Telugu (తెలుగు)
- `bn` - Bengali (বাংলা)
- `mr` - Marathi (मराठी)
- `gu` - Gujarati (ગુજરાતી)
- `kn` - Kannada (ಕನ್ನಡ)

You can use any language code supported by Google Translate API (e.g., `es` for Spanish, `fr` for French, `de` for German, etc.)

## Troubleshooting

### Server won't start
- Check if dependencies are installed: `npm install`
- Check if port 3000 is available
- Check for syntax errors in code

### "API key not configured" error
- Create `.env` file in backend directory
- Add `GOOGLE_TRANSLATE_API_KEY=your_key`
- Restart the server

### Translation fails with valid API key
- Verify API key in Google Cloud Console
- Check if Cloud Translation API is enabled
- Verify API key restrictions (should allow Translation API)
- Check Google Cloud Console for quota/billing issues

### No logs appearing
- Make sure you're looking at the correct terminal (where `npm start` was run)
- Check if requests are reaching the server (try health check)

## Summary

The FundingIntel Backend API is now fully functional and provides:
- ✅ Comprehensive error handling with clear messages
- ✅ Success/failure logging for debugging
- ✅ Request validation
- ✅ Google Translation API integration
- ✅ Batch translation support
- ✅ Language detection
- ✅ Graceful handling of missing API key

All endpoints print success or failure messages as required!

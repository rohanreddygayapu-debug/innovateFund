// FundingIntel Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translationRoutes from './routes/translationRoutes.js';
import transliterationRoutes from './routes/transliterationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ Health check successful');
  res.json({ 
    status: 'healthy', 
    message: 'FundingIntel Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', translationRoutes);
app.use('/api', transliterationRoutes);
app.use('/api/documents', documentRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`⚠️  404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ ERROR: Unhandled error:', err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 FundingIntel Backend API Server Started');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Translation API: http://localhost:${PORT}/api/translate`);
  console.log(`🔤 Transliteration API: http://localhost:${PORT}/api/transliterate`);
  console.log(`📚 Document Search API: http://localhost:${PORT}/api/documents`);
  console.log('='.repeat(60));
  
  // Check if API key is configured
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    console.log('');
    console.log('⚠️  WARNING: Google Translate API key not configured!');
    console.log('   Please set GOOGLE_TRANSLATE_API_KEY in .env file');
    console.log('   Translation features will not work without it.');
    console.log('');
  } else {
    console.log('✅ Google Translate API key configured');
    console.log('');
  }
  
  console.log('📝 Logs will appear here...\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

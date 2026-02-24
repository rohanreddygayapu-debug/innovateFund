// Document Search Routes
import express from 'express';
import { 
  initializeVectorStore, 
  searchDocuments, 
  getVectorStoreStatus 
} from '../services/vectorStoreService.js';

const router = express.Router();

/**
 * POST /api/documents/search
 * Search documents using vector similarity
 */
router.post('/search', async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
      });
    }
    
    console.log(`🔍 Document search request: "${query}"`);
    
    const results = await searchDocuments(query, topK);
    
    console.log('✅ Search completed successfully');
    
    res.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('❌ Document search error:', error.message);
    
    if (error.message.includes('not initialized')) {
      return res.status(503).json({
        success: false,
        error: 'Vector store not initialized. Please initialize first.',
        needsInitialization: true,
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/documents/initialize
 * Initialize vector store with PDFs
 */
router.post('/initialize', async (req, res) => {
  try {
    console.log('🚀 Vector store initialization request');
    
    const result = await initializeVectorStore();
    
    console.log('✅ Vector store initialization completed');
    
    res.json(result);
  } catch (error) {
    console.error('❌ Vector store initialization error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/documents/status
 * Get vector store status
 */
router.get('/status', (req, res) => {
  const status = getVectorStoreStatus();
  
  res.json({
    success: true,
    ...status,
  });
});

export default router;

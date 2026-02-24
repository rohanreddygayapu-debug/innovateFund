// Transliteration Routes
import express from 'express';
import { transliterateText, transliterateBatch } from '../services/transliterationService.js';

const router = express.Router();

/**
 * POST /api/transliterate
 * Transliterate a single text from Latin script to target language script
 * 
 * Body:
 * {
 *   "text": "namaste",
 *   "targetLanguage": "hi"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "transliteratedText": "नमस्ते",
 *   "suggestions": ["नमस्ते", "नमस्ते।", ...]
 * }
 */
router.post('/transliterate', async (req, res) => {
  console.log('📨 POST /api/transliterate - Transliterate text request received');
  
  const { text, targetLanguage } = req.body;

  // Validate input
  if (!text) {
    console.error('❌ Missing required field: text');
    return res.status(400).json({
      success: false,
      error: 'Missing required field: text',
    });
  }

  if (!targetLanguage) {
    console.error('❌ Missing required field: targetLanguage');
    return res.status(400).json({
      success: false,
      error: 'Missing required field: targetLanguage',
    });
  }

  try {
    const result = await transliterateText(text, targetLanguage);
    
    if (result.success) {
      console.log(`✅ Transliteration successful for "${text}"`);
      return res.json(result);
    } else {
      console.error(`❌ Transliteration failed: ${result.error}`);
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(`❌ Transliteration error:`, error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/transliterate/batch
 * Transliterate multiple texts at once
 * 
 * Body:
 * {
 *   "texts": ["namaste", "dhanyavaad"],
 *   "targetLanguage": "hi"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "results": ["नमस्ते", "धन्यवाद"]
 * }
 */
router.post('/transliterate/batch', async (req, res) => {
  console.log('📨 POST /api/transliterate/batch - Batch transliteration request received');
  
  const { texts, targetLanguage } = req.body;

  // Validate input
  if (!texts || !Array.isArray(texts)) {
    console.error('❌ Missing or invalid field: texts (must be an array)');
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid field: texts (must be an array)',
    });
  }

  if (!targetLanguage) {
    console.error('❌ Missing required field: targetLanguage');
    return res.status(400).json({
      success: false,
      error: 'Missing required field: targetLanguage',
    });
  }

  try {
    const result = await transliterateBatch(texts, targetLanguage);
    
    if (result.success) {
      console.log(`✅ Batch transliteration successful for ${texts.length} texts`);
      return res.json(result);
    } else {
      console.error(`❌ Batch transliteration failed: ${result.error}`);
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error(`❌ Batch transliteration error:`, error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

// Translation API routes
import express from 'express';
import { translateText, translateBatch, detectLanguage } from '../services/translationService.js';

const router = express.Router();

/**
 * POST /api/translate
 * Translate text from one language to another
 * Body: { text, targetLanguage, sourceLanguage }
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!text) {
      console.error('❌ ERROR: Missing required field: text');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: text',
      });
    }

    if (!targetLanguage) {
      console.error('❌ ERROR: Missing required field: targetLanguage');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: targetLanguage',
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const result = await translateText(text, targetLanguage, sourceLanguage, apiKey);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ ERROR: Unexpected error in /translate:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/translate/batch
 * Translate multiple texts at once
 * Body: { texts[], targetLanguage, sourceLanguage }
 */
router.post('/translate/batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!texts || !Array.isArray(texts)) {
      console.error('❌ ERROR: Missing or invalid field: texts (must be an array)');
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid field: texts (must be an array)',
      });
    }

    if (!targetLanguage) {
      console.error('❌ ERROR: Missing required field: targetLanguage');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: targetLanguage',
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const result = await translateBatch(texts, targetLanguage, sourceLanguage, apiKey);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ ERROR: Unexpected error in /translate/batch:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/translate/detect
 * Detect the language of input text
 * Body: { text }
 */
router.post('/translate/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      console.error('❌ ERROR: Missing required field: text');
      return res.status(400).json({
        success: false,
        error: 'Missing required field: text',
      });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const result = await detectLanguage(text, apiKey);

    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error('❌ ERROR: Unexpected error in /translate/detect:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;

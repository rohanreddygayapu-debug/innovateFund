// Translation service using Google Cloud Translation API
import axios from 'axios';

const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';
const DETECT_API_URL = 'https://translation.googleapis.com/language/translate/v2/detect';

/**
 * Translates text from one language to another using Google Cloud Translation API
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'hi', 'ta', 'te')
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @param {string} apiKey - Google Translate API Key
 * @returns {Promise<{success: boolean, translatedText?: string, error?: string}>}
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'en', apiKey) => {
  // If target is English or same as source, return original text
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    console.log(`✅ No translation needed (target: ${targetLanguage}, source: ${sourceLanguage})`);
    return { success: true, translatedText: text };
  }

  if (!apiKey) {
    const errorMsg = '❌ ERROR: Google Translate API key not configured';
    console.error(errorMsg);
    return { success: false, error: 'API key not configured' };
  }

  try {
    console.log(`🔄 Translating text from ${sourceLanguage} to ${targetLanguage}...`);
    
    const response = await axios.post(
      `${TRANSLATE_API_URL}?key=${apiKey}`,
      {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.data && response.data.data.translations && response.data.data.translations.length > 0) {
      const translatedText = response.data.data.translations[0].translatedText;
      const textPreview = text.length > 50 ? text.substring(0, 50) + '...' : text;
      const translatedPreview = translatedText.length > 50 ? translatedText.substring(0, 50) + '...' : translatedText;
      console.log(`✅ Translation successful: "${textPreview}" → "${translatedPreview}"`);
      return { success: true, translatedText };
    }

    const errorMsg = '❌ ERROR: Invalid response from Translation API';
    console.error(errorMsg);
    return { success: false, error: 'Invalid API response' };
  } catch (error) {
    const errorMsg = `❌ ERROR: Translation failed - ${error.response?.data?.error?.message || error.message}`;
    console.error(errorMsg);
    return { 
      success: false, 
      error: error.response?.data?.error?.message || error.message 
    };
  }
};

/**
 * Translates multiple texts in a single API call (more efficient)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @param {string} apiKey - Google Translate API Key
 * @returns {Promise<{success: boolean, translations?: string[], error?: string}>}
 */
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'en', apiKey) => {
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    console.log(`✅ No translation needed for batch (target: ${targetLanguage}, source: ${sourceLanguage})`);
    return { success: true, translations: texts };
  }

  if (!apiKey) {
    const errorMsg = '❌ ERROR: Google Translate API key not configured';
    console.error(errorMsg);
    return { success: false, error: 'API key not configured' };
  }

  try {
    console.log(`🔄 Batch translating ${texts.length} texts from ${sourceLanguage} to ${targetLanguage}...`);
    
    const response = await axios.post(
      `${TRANSLATE_API_URL}?key=${apiKey}`,
      {
        q: texts,
        target: targetLanguage,
        source: sourceLanguage,
        format: 'text',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.data && response.data.data.translations) {
      const translations = response.data.data.translations.map(t => t.translatedText);
      console.log(`✅ Batch translation successful: ${texts.length} texts translated`);
      return { success: true, translations };
    }

    const errorMsg = '❌ ERROR: Invalid response from Translation API';
    console.error(errorMsg);
    return { success: false, error: 'Invalid API response' };
  } catch (error) {
    const errorMsg = `❌ ERROR: Batch translation failed - ${error.response?.data?.error?.message || error.message}`;
    console.error(errorMsg);
    return { 
      success: false, 
      error: error.response?.data?.error?.message || error.message 
    };
  }
};

/**
 * Detects the language of the input text
 * @param {string} text - Text to detect language
 * @param {string} apiKey - Google Translate API Key
 * @returns {Promise<{success: boolean, language?: string, confidence?: number, error?: string}>}
 */
export const detectLanguage = async (text, apiKey) => {
  if (!apiKey) {
    const errorMsg = '❌ ERROR: Google Translate API key not configured';
    console.error(errorMsg);
    return { success: false, error: 'API key not configured' };
  }

  try {
    const textPreview = text.length > 50 ? text.substring(0, 50) + '...' : text;
    console.log(`🔍 Detecting language for text: "${textPreview}"`);
    
    const response = await axios.post(
      `${DETECT_API_URL}?key=${apiKey}`,
      {
        q: text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.data && response.data.data.detections && response.data.data.detections.length > 0) {
      const detection = response.data.data.detections[0][0];
      console.log(`✅ Language detected: ${detection.language} (confidence: ${detection.confidence})`);
      return { 
        success: true, 
        language: detection.language,
        confidence: detection.confidence
      };
    }

    const errorMsg = '❌ ERROR: Invalid response from Language Detection API';
    console.error(errorMsg);
    return { success: false, error: 'Invalid API response' };
  } catch (error) {
    const errorMsg = `❌ ERROR: Language detection failed - ${error.response?.data?.error?.message || error.message}`;
    console.error(errorMsg);
    return { 
      success: false, 
      error: error.response?.data?.error?.message || error.message 
    };
  }
};

export default {
  translateText,
  translateBatch,
  detectLanguage,
};

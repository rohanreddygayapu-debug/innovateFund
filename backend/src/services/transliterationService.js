// Transliteration service using Google Input Tools API
import axios from 'axios';

// Google Input Tools API endpoint
const GOOGLE_INPUT_TOOLS_URL = 'https://inputtools.google.com/request';

// Language code mapping for Google Input Tools
const LANGUAGE_MAP = {
  'hi': 'hi-t-i0-und', // Hindi
  'ta': 'ta-t-i0-und', // Tamil
  'te': 'te-t-i0-und', // Telugu
  'bn': 'bn-t-i0-und', // Bengali
  'mr': 'mr-t-i0-und', // Marathi
  'gu': 'gu-t-i0-und', // Gujarati
  'kn': 'kn-t-i0-und', // Kannada
};

/**
 * Transliterates text from Latin script to target Indic language script
 * @param {string} text - The text to transliterate (in Latin/English characters)
 * @param {string} targetLanguage - Target language code (e.g., 'hi', 'ta', 'te')
 * @returns {Promise<{success: boolean, transliteratedText?: string, suggestions?: string[], error?: string}>}
 */
export const transliterateText = async (text, targetLanguage) => {
  // If target is English or no text, return original
  if (targetLanguage === 'en' || !text || text.trim() === '') {
    return { success: true, transliteratedText: text, suggestions: [] };
  }

  // Check if language is supported
  const inputMethod = LANGUAGE_MAP[targetLanguage];
  if (!inputMethod) {
    console.log(`⚠️  Transliteration not supported for language: ${targetLanguage}`);
    return { success: true, transliteratedText: text, suggestions: [] };
  }

  try {
    console.log(`🔄 Transliterating "${text}" to ${targetLanguage}...`);
    
    // Note: Google Input Tools is a public service that doesn't require authentication
    // The service uses a public endpoint for transliteration
    // Prepare request for Google Input Tools API
    const requestData = {
      method: 'transliterate',
      params: {
        text: text,
        num: 5, // Number of suggestions to return
        inputmethod: inputMethod,
      },
    };

    const response = await axios.post(
      `${GOOGLE_INPUT_TOOLS_URL}?text=${text}&ime=${inputMethod}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`,
      null,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Parse the response
    if (response.data && Array.isArray(response.data) && response.data[0] === 'SUCCESS') {
      const results = response.data[1];
      if (results && results.length > 0 && results[0][1] && results[0][1].length > 0) {
        const suggestions = results[0][1];
        const transliteratedText = suggestions[0]; // Use the first suggestion as primary result
        
        console.log(`✅ Transliteration successful: "${text}" → "${transliteratedText}"`);
        return {
          success: true,
          transliteratedText,
          suggestions,
        };
      }
    }

    // If API didn't return expected format, return original text
    console.log(`⚠️  No transliteration suggestions received, returning original text`);
    return { success: true, transliteratedText: text, suggestions: [] };
  } catch (error) {
    console.error(`❌ Transliteration failed:`, error.message);
    // Return original text on error, don't fail the request
    return { 
      success: true, 
      transliteratedText: text, 
      suggestions: [],
      error: error.message 
    };
  }
};

/**
 * Transliterates an array of text strings
 * @param {string[]} texts - Array of texts to transliterate
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<{success: boolean, results?: string[], error?: string}>}
 */
export const transliterateBatch = async (texts, targetLanguage) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return { success: false, error: 'Invalid input: texts must be a non-empty array' };
  }

  try {
    const results = await Promise.all(
      texts.map(text => transliterateText(text, targetLanguage))
    );

    const transliteratedTexts = results.map(result => 
      result.success ? result.transliteratedText : ''
    );

    return {
      success: true,
      results: transliteratedTexts,
    };
  } catch (error) {
    console.error('❌ Batch transliteration failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  transliterateText,
  transliterateBatch,
};

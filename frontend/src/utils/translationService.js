// Translation service - Frontend client for backend API

const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Industry-ready constants for safe API limits
const CHUNK_SIZE = 25; // Max 20-30 texts per request (safe limit)
const MAX_CHUNK_SIZE = 30; // Upper safety limit

/**
 * Chunks array into smaller arrays of safe size
 * @param {string[]} array - Array to chunk
 * @param {number} size - Chunk size (default: 25)
 * @returns {string[][]} - Array of chunks
 */
const chunkArray = (array, size = CHUNK_SIZE) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Translates text from one language to another using the backend API
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'hi', 'ta', 'te')
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
  // If target is English or same as source, return original text
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    console.log(`✅ No translation needed (${targetLanguage})`);
    return text;
  }

  try {
    console.log(`🔄 Translating to ${targetLanguage}...`);
    
    const response = await fetch(`${BACKEND_API_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage,
      }),
    });

    const data = await response.json();

    if (data.success && data.translatedText) {
      console.log(`✅ Language changed successfully to ${targetLanguage}`);
      return data.translatedText;
    }

    console.error('❌ Translation failed:', data.error || 'Unknown error');
    return text;
  } catch (error) {
    console.error('❌ Translation error:', error.message);
    return text;
  }
};

/**
 * Translates multiple texts in chunked requests (INDUSTRY-READY)
 * Prevents API overload by limiting requests to 25 items per call
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'en') => {
  if (targetLanguage === 'en' || targetLanguage === sourceLanguage) {
    console.log(`✅ No batch translation needed (${targetLanguage})`);
    return texts;
  }

  if (!Array.isArray(texts) || texts.length === 0) {
    console.warn('⚠️ Invalid texts array provided');
    return texts;
  }

  try {
    // If texts fit in one chunk, use single request (optimization)
    if (texts.length <= CHUNK_SIZE) {
      console.log(`🔄 Batch translating ${texts.length} texts to ${targetLanguage}...`);
      return await _translateChunk(texts, targetLanguage, sourceLanguage);
    }

    // INDUSTRY-READY: Chunk large requests into safe batches
    console.log(`🔄 Batch translating ${texts.length} texts to ${targetLanguage} (chunking into ${Math.ceil(texts.length / CHUNK_SIZE)} requests)...`);
    const chunks = chunkArray(texts, CHUNK_SIZE);
    const results = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkNum = i + 1;
      const totalChunks = chunks.length;
      console.log(`📦 Processing chunk ${chunkNum}/${totalChunks} (${chunks[i].length} texts)...`);
      
      const chunkResults = await _translateChunk(chunks[i], targetLanguage, sourceLanguage);
      results.push(...chunkResults);

      // Small delay between chunks to prevent API throttling
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`✅ Batch translation complete - ${texts.length} texts translated to ${targetLanguage}`);
    return results;
  } catch (error) {
    console.error('❌ Batch translation error:', error.message);
    return texts;
  }
};

/**
 * Private helper: Translates a single chunk of texts
 * @private
 * @param {string[]} texts - Array of texts (should be <= 25)
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
const _translateChunk = async (texts, targetLanguage, sourceLanguage) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/translate/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage,
        sourceLanguage,
      }),
    });

    const data = await response.json();

    if (data.success && data.translations) {
      return data.translations;
    }

    console.error('❌ Chunk translation failed:', data.error || 'Unknown error');
    return texts;
  } catch (error) {
    console.error('❌ Chunk translation error:', error.message);
    return texts;
  }
};

/**
 * Detects the language of the input text
 * @param {string} text - Text to detect language
 * @returns {Promise<string>} - Detected language code
 */
export const detectLanguage = async (text) => {
  try {
    console.log(`🔍 Detecting language...`);
    
    const response = await fetch(`${BACKEND_API_URL}/translate/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    if (data.success && data.language) {
      console.log(`✅ Language detected: ${data.language} (confidence: ${data.confidence})`);
      return data.language;
    }

    console.error('❌ Language detection failed:', data.error || 'Unknown error');
    return 'en';
  } catch (error) {
    console.error('❌ Language detection error:', error.message);
    return 'en';
  }
};

/**
 * Merges multiple texts into larger paragraphs for batch processing
 * Alternative to chunking - useful when text order matters
 * @param {string[]} texts - Array of texts to merge
 * @param {string} separator - Separator between texts (default: '\n')
 * @returns {string} - Merged text
 */
export const mergeTexts = (texts, separator = '\n') => {
  if (!Array.isArray(texts)) return '';
  return texts.filter(t => t && t.trim()).join(separator);
};

/**
 * Transliterates text from Latin script to target language script
 * @param {string} text - Text in Latin/English characters (e.g., "namaste")
 * @param {string} targetLanguage - Target language code (e.g., 'hi', 'ta', 'te')
 * @returns {Promise<{text: string, suggestions: string[]}>} - Transliterated text and suggestions
 */
export const transliterateText = async (text, targetLanguage) => {
  // If target is English or no text, return original
  if (targetLanguage === 'en' || !text || text.trim() === '') {
    return { text, suggestions: [] };
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/transliterate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
      }),
    });

    const data = await response.json();

    if (data.success && data.transliteratedText) {
      return {
        text: data.transliteratedText,
        suggestions: data.suggestions || [],
      };
    }

    return { text, suggestions: [] };
  } catch (error) {
    console.error('❌ Transliteration error:', error.message);
    return { text, suggestions: [] };
  }
};

export default {
  translateText,
  translateBatch,
  detectLanguage,
  chunkArray: undefined, // Internal use only
  mergeTexts,
  transliterateText,
};

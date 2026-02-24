import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateBatch } from '../utils/translationService';
import enTranslations from '../locales/en.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function to flatten nested JSON structure
const flattenObject = (obj, prefix = '') => {
  const flattened = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`));
    } else {
      flattened[`${prefix}${key}`] = obj[key];
    }
  }
  return flattened;
};

// Helper function to unflatten object
const unflattenObject = (obj) => {
  const result = {};
  for (const key in obj) {
    const keys = key.split('.');
    keys.reduce((acc, k, idx) => {
      if (idx === keys.length - 1) {
        acc[k] = obj[key];
      } else {
        acc[k] = acc[k] || {};
      }
      return acc[k];
    }, result);
  }
  return result;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'en', name: 'English (US)', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  ];

  const setLanguage = async (langCode) => {
    if (langCode === language) return;

    console.log(`🔄 Switching language to ${langCode}...`);
    setIsTranslating(true);
    
    try {
      // If changing to English, just use the base translations
      if (langCode === 'en') {
        i18n.changeLanguage('en');
        setLanguageState('en');
        console.log('✅ Language changed to English');
        setIsTranslating(false);
        return;
      }

      // Check if translations already exist for this language
      if (!i18n.hasResourceBundle(langCode, 'translation')) {
        console.log(`🔄 Translating content to ${langCode}...`);
        
        // Flatten the English translations
        const flattenedEn = flattenObject(enTranslations);
        const textsToTranslate = Object.values(flattenedEn);
        
        // Translate all texts using the backend API
        const translatedTexts = await translateBatch(textsToTranslate, langCode, 'en');
        
        // Create translated object
        const translatedFlat = {};
        Object.keys(flattenedEn).forEach((key, index) => {
          translatedFlat[key] = translatedTexts[index];
        });
        
        // Unflatten and add to i18n
        const translatedObject = unflattenObject(translatedFlat);
        i18n.addResourceBundle(langCode, 'translation', translatedObject);
        
        console.log(`✅ Translation complete for ${langCode}`);
      }

      // Change the language
      i18n.changeLanguage(langCode);
      setLanguageState(langCode);
      console.log(`✅ Language changed successfully to ${langCode}`);
    } catch (error) {
      console.error('❌ Failed to change language:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const value = {
    language,
    setLanguage,
    languages,
    isTranslating,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
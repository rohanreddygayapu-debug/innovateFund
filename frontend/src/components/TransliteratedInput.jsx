import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Language code mapping for Google Input Tools
const LANGUAGE_INPUT_METHODS = {
  'hi': 'hi-t-i0-und', // Hindi
  'ta': 'ta-t-i0-und', // Tamil
  'te': 'te-t-i0-und', // Telugu
  'bn': 'bn-t-i0-und', // Bengali
  'mr': 'mr-t-i0-und', // Marathi
  'gu': 'gu-t-i0-und', // Gujarati
  'kn': 'kn-t-i0-und', // Kannada
};

/**
 * Transliterate text using Google Input Tools API
 * @param {string} text - Text to transliterate
 * @param {string} inputMethod - Input method code
 * @param {number} maxResults - Maximum number of suggestions
 * @returns {Promise<string[]>} - Array of transliteration suggestions
 */
const transliterateWithGoogleAPI = async (text, inputMethod, maxResults = 5) => {
  try {
    const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=${inputMethod}&num=${maxResults}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse response: [status, [[source, [suggestions]]]]
    if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
      return data[1][0][1]; // Array of transliterated suggestions
    }
    
    return [];
  } catch (error) {
    console.error('Transliteration error:', error);
    return [];
  }
};

/**
 * TransliteratedInput Component
 * 
 * A text input component that automatically transliterates Latin characters
 * to the selected Indic language script as the user types.
 * 
 * Features:
 * - Real-time transliteration based on selected language
 * - Debounced API calls to avoid excessive requests
 * - Suggestion dropdown for alternative transliterations
 * - Falls back to original text if transliteration fails
 * 
 * Props:
 * - value: Current input value
 * - onChange: Callback when value changes
 * - placeholder: Placeholder text
 * - className: Additional CSS classes
 * - as: Component type ('input' or 'textarea', default: 'input')
 * - All other props are passed through to the underlying input/textarea
 */
const TransliteratedInput = ({ 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  as = 'input',
  disabled = false,
  debounceDelay = 300, // Configurable debounce delay in milliseconds
  ...props 
}) => {
  const { language } = useLanguage();
  const [localValue, setLocalValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTransliterating, setIsTransliterating] = useState(false);
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

  // Update local value when prop value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Handle input change with transliteration
  const handleInputChange = async (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // If language is English or disabled, just update normally
    if (language === 'en' || disabled || !LANGUAGE_INPUT_METHODS[language]) {
      onChange && onChange(e);
      return;
    }

    // Clear existing debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // For non-English languages, perform transliteration
    setIsTransliterating(true);

    // Debounce transliteration to avoid excessive calls
    debounceTimer.current = setTimeout(async () => {
      if (newValue.trim() === '') {
        setIsTransliterating(false);
        onChange && onChange(e);
        return;
      }

      try {
        // Get last word being typed (for word-by-word transliteration)
        const words = newValue.split(' ');
        const lastWord = words[words.length - 1];
        
        if (lastWord.trim() !== '') {
          // Use Google Input Tools API for transliteration
          const inputMethod = LANGUAGE_INPUT_METHODS[language];
          const transliteratedOptions = await transliterateWithGoogleAPI(lastWord, inputMethod, 5);
          
          setIsTransliterating(false);
          
          if (transliteratedOptions.length > 0) {
            const transliteratedText = transliteratedOptions[0];
            
            // Replace last word with transliterated version
            const transliteratedValue = words.slice(0, -1).concat(transliteratedText).join(' ');
            setLocalValue(transliteratedValue);
            
            // Update parent component
            const syntheticEvent = {
              target: { value: transliteratedValue }
            };
            onChange && onChange(syntheticEvent);

            // Store suggestions
            if (transliteratedOptions.length > 1) {
              setSuggestions(transliteratedOptions.slice(1)); // Exclude first suggestion (already applied)
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          } else {
            onChange && onChange(e);
          }
        } else {
          setIsTransliterating(false);
          onChange && onChange(e);
        }
      } catch (error) {
        console.error('Transliteration error:', error);
        setIsTransliterating(false);
        onChange && onChange(e);
      }
    }, debounceDelay); // Configurable debounce delay
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const words = localValue.split(' ');
    const updatedValue = words.slice(0, -1).concat(suggestion).join(' ');
    setLocalValue(updatedValue);
    
    const syntheticEvent = {
      target: { value: updatedValue }
    };
    onChange && onChange(syntheticEvent);
    
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Focus back on input
    inputRef.current?.focus();
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside both input and suggestions dropdown
      const suggestionEl = inputRef.current?.parentElement?.querySelector('.transliteration-suggestions');
      const isClickInsideSuggestions = suggestionEl?.contains(e.target);
      const isClickInsideInput = inputRef.current?.contains(e.target);
      
      if (!isClickInsideInput && !isClickInsideSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="transliterated-input-wrapper" style={{ position: 'relative' }}>
      <Component
        ref={inputRef}
        type={as === 'input' ? 'text' : undefined}
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`${className} ${isTransliterating ? 'transliterating' : ''}`}
        disabled={disabled}
        {...props}
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="transliteration-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Transliteration indicator */}
      {isTransliterating && language !== 'en' && (
        <div className="transliteration-indicator">
          <span className="transliteration-spinner"></span>
        </div>
      )}
    </div>
  );
};

export default TransliteratedInput;

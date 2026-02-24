import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Building, MapPin, Sparkles, TrendingUp, Users, FileText, ExternalLink, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateBatch } from '../utils/translationService';
import TransliteratedInput from '../components/TransliteratedInput';

const IntelligencePage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('');
  const [stage, setStage] = useState('seed');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vectorStoreStatus, setVectorStoreStatus] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [initializationError, setInitializationError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Check vector store status on mount
  useEffect(() => {
    checkVectorStoreStatus();
  }, []);

  const checkVectorStoreStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/status`);
      const data = await response.json();
      setVectorStoreStatus(data);
      
      // Auto-initialize if not initialized
      if (!data.initialized) {
        await initializeVectorStore();
      }
    } catch (error) {
      console.error('Error checking vector store status:', error);
      setInitializationError('Unable to connect to document search service. Using mock data for demonstration.');
    }
  };

  const initializeVectorStore = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/initialize`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setVectorStoreStatus({ initialized: true, ...data });
        setInitializationError(null);
      } else {
        setInitializationError('Document search is initializing. This may take a moment on first load as the AI model downloads.');
      }
    } catch (error) {
      console.error('Error initializing vector store:', error);
      setInitializationError('Document search unavailable. Using mock data for demonstration.');
    }
  };

  const domains = [
    'AgriTech', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
    'SaaS', 'AI/ML', 'CleanTech', 'FoodTech', 'DeepTech'
  ];

  const stages = [
    { value: 'idea', label: t('intelligence.idea_preseed') },
    { value: 'seed', label: t('intelligence.seed') },
    { value: 'series-a', label: t('intelligence.series_a') },
    { value: 'series-b', label: t('intelligence.series_b_plus') },
    { value: 'growth', label: t('intelligence.growth') },
  ];

  // Function to translate result data
  const translateResultData = async (resultData, targetLanguage) => {
    if (targetLanguage === 'en') {
      return resultData; // No translation needed for English
    }

    try {
      // Collect all texts to translate
      const textsToTranslate = [];
      const textMapping = [];

      // Add analysis
      textsToTranslate.push(resultData.analysis);
      textMapping.push({ type: 'analysis', index: textsToTranslate.length - 1 });

      // Add scheme texts
      resultData.schemes.forEach((scheme, schemeIdx) => {
        textsToTranslate.push(scheme.name, scheme.description, scheme.eligibility, scheme.type);
        textMapping.push(
          { type: 'scheme', schemeIdx, field: 'name', index: textsToTranslate.length - 4 },
          { type: 'scheme', schemeIdx, field: 'description', index: textsToTranslate.length - 3 },
          { type: 'scheme', schemeIdx, field: 'eligibility', index: textsToTranslate.length - 2 },
          { type: 'scheme', schemeIdx, field: 'type', index: textsToTranslate.length - 1 }
        );
      });

      // Add document texts
      if (resultData.documents && resultData.documents.length > 0) {
        resultData.documents.forEach((doc, docIdx) => {
          textsToTranslate.push(doc.content, doc.metadata.source);
          textMapping.push(
            { type: 'document', docIdx, field: 'content', index: textsToTranslate.length - 2 },
            { type: 'document', docIdx, field: 'source', index: textsToTranslate.length - 1 }
          );
        });
      }

      // Translate all texts in batch
      const translatedTexts = await translateBatch(textsToTranslate, targetLanguage, 'en');

      // Build translated result
      let translatedAnalysis = resultData.analysis;
      const translatedSchemes = resultData.schemes.map(s => ({...s}));
      const translatedDocuments = resultData.documents ? resultData.documents.map(d => ({
        ...d,
        metadata: {...d.metadata}
      })) : [];

      // Apply translations
      textMapping.forEach(mapping => {
        const translatedText = translatedTexts[mapping.index];
        if (mapping.type === 'analysis') {
          translatedAnalysis = translatedText;
        } else if (mapping.type === 'scheme') {
          translatedSchemes[mapping.schemeIdx][mapping.field] = translatedText;
        } else if (mapping.type === 'document') {
          if (mapping.field === 'content') {
            translatedDocuments[mapping.docIdx].content = translatedText;
          } else if (mapping.field === 'source') {
            translatedDocuments[mapping.docIdx].metadata.source = translatedText;
          }
        }
      });

      return {
        ...resultData,
        analysis: translatedAnalysis,
        schemes: translatedSchemes,
        documents: translatedDocuments,
      };
    } catch (error) {
      console.error('Error translating result data:', error);
      return resultData; // Return original data if translation fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      // Only try vector search if initialized or no error
      if (!initializationError && vectorStoreStatus?.initialized) {
        // Search documents using vector search
        const searchResponse = await fetch(`${API_BASE_URL}/documents/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            topK: 5,
          }),
        });

        const searchData = await searchResponse.json();

        if (searchData.success) {
          // Format the results for display
          const relevantDocs = searchData.results;
          
          // Extract policy/scheme information from documents
          const schemes = relevantDocs.map((doc) => {
            const isStartupIndia = doc.metadata.source.includes('Startup India');
            return {
              name: doc.metadata.source,
              type: isStartupIndia ? 'SEED FUND' : 'GUIDELINE',
              description: doc.content.substring(0, 200) + '...',
              eligibility: doc.relevanceScore > 0.7 ? 'High Relevance' : 'Moderate Relevance',
              source: doc.metadata.source,
              chunkIndex: doc.metadata.chunkIndex,
              relevanceScore: doc.relevanceScore,
            };
          });

          // Generate a simple analysis based on search results
          const analysis = `Based on your query about ${domain || 'startup funding'} at the ${stage} stage${location ? ` in ${location}` : ''}, we found ${relevantDocs.length} relevant sections from government funding documents. The information below is extracted from official schemes and guidelines.`;

          const resultData = {
            analysis,
            documents: relevantDocs,
            investors: [
              {
                name: 'Omnivore',
                type: 'VC Firm',
                location: 'Mumbai',
                ticketSize: '₹5Cr - ₹25Cr',
                focus: 'AgriTech, Climate',
              },
              {
                name: 'Ankur Capital',
                type: 'VC Firm',
                location: 'Bangalore',
                ticketSize: '₹3Cr - ₹15Cr',
                focus: 'DeepTech, Agri',
              },
            ],
            schemes,
            sources: [...new Set(relevantDocs.map(doc => doc.metadata.source))],
          };

          // Translate result data if not in English
          const translatedResult = await translateResultData(resultData, language);
          setResult(translatedResult);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to mock data if vector search unavailable or failed
      console.log('Using mock data for demonstration');
      const mockResultData = {
        analysis: `For a ${domain || 'startup'} in ${location || 'India'} at the ${stage} stage, the ecosystem is highly favorable. ${initializationError ? 'Note: Document search is currently unavailable. Showing sample data for demonstration.' : ''} You should focus on a mix of Government Grants and Impact VCs. Various schemes like Startup India Seed Fund are available for early-stage startups.`,
        investors: [
          {
            name: 'Omnivore',
            type: 'VC Firm',
            location: 'Mumbai',
            ticketSize: '₹5Cr - ₹25Cr',
            focus: 'AgriTech, Climate',
          },
          {
            name: 'Ankur Capital',
            type: 'VC Firm',
            location: 'Bangalore',
            ticketSize: '₹3Cr - ₹15Cr',
            focus: 'DeepTech, Agri',
          },
        ],
        schemes: [
          {
            name: 'RKVY-RAFTAAR',
            type: 'GRANT',
            description: 'Pre-seed stage funding up to ₹5 Lakhs for innovative agri-solutions.',
            eligibility: 'High Eligibility',
          },
          {
            name: 'Startup India Seed Fund',
            type: 'DEBT/CONV',
            description: 'Financial assistance for proof of concept, prototype development.',
            eligibility: 'Check Eligibility',
          },
        ],
        sources: [
          'Startup India (Sample)',
          'Government Schemes (Sample)',
          'Mock Data for Demo',
        ],
      };

      // Translate mock data if not in English
      const translatedMockResult = await translateResultData(mockResultData, language);
      setResult(translatedMockResult);
    } catch (error) {
      console.error('Error during search:', error);
      // Fallback to mock data on error
      const errorMockData = {
        analysis: "For an AgriTech startup in Karnataka at the Seed stage, the ecosystem is highly favorable. Karnataka is home to the 'Grand Challenge Karnataka' specifically for agriculture. You should focus on a mix of Government Grants (RKVY) and Impact VCs. Drone technology for farming is currently a priority sector under the PLI scheme for Drones.",
        investors: [
          {
            name: 'Omnivore',
            type: 'VC Firm',
            location: 'Mumbai',
            ticketSize: '₹5Cr - ₹25Cr',
            focus: 'AgriTech, Climate',
          },
          {
            name: 'Ankur Capital',
            type: 'VC Firm',
            location: 'Bangalore',
            ticketSize: '₹3Cr - ₹15Cr',
            focus: 'DeepTech, Agri',
          },
        ],
        schemes: [
          {
            name: 'RKVY-RAFTAAR',
            type: 'GRANT',
            description: 'Pre-seed stage funding up to ₹5 Lakhs for innovative agri-solutions.',
            eligibility: 'High Eligibility',
          },
          {
            name: 'Startup India Seed Fund',
            type: 'DEBT/CONV',
            description: 'Financial assistance for proof of concept, prototype development.',
            eligibility: 'Check Eligibility',
          },
        ],
        sources: [
          'Startup India',
          'Invest Karnataka',
          'Tracxn (Data updated 2 days ago)',
        ],
      };

      // Translate error mock data if not in English
      const translatedErrorResult = await translateResultData(errorMockData, language);
      setResult(translatedErrorResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (isPositive) => {
    setFeedback(isPositive ? 'positive' : 'negative');
    // TODO: Send feedback to analytics service
  };

  return (
    <div className="intelligence-page">
      <div className="container">
        <div className="intelligence-header">
          <h1>{t('intelligence.title')}</h1>
          <p>{t('intelligence.subtitle')}</p>
        </div>

        {/* Initialization Error Banner */}
        {initializationError && (
          <div className="alert-banner warning">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Document Search Unavailable</strong>
              <p>{initializationError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="query-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>{t('intelligence.domain')}</label>
              <div className="input-wrapper">
                <Building size={18} className="input-icon" />
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="form-select"
                >
                  <option value="">{t('intelligence.all_domains')}</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{t('intelligence.location')}</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <TransliteratedInput
                  type="text"
                  placeholder="Karnataka"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>{t('intelligence.funding_stage')}</label>
            <div className="stage-selector">
              {stages.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`stage-btn ${stage === s.value ? 'active' : ''}`}
                  onClick={() => setStage(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('intelligence.describe_query')}</label>
            <TransliteratedInput
              as="textarea"
              className="query-textarea"
              placeholder={t('intelligence.query_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              required
            />
            <div className="form-hint">
              <Sparkles size={14} />
              <span>{t('intelligence.supports_languages')}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-large btn-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div>
                {t('intelligence.generating_insights')}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {t('intelligence.generate_funding_plan')}
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="results-section">
            <div className="results-header">
              <h2>{t('intelligence.results_header')}</h2>
            </div>

            {/* Analysis */}
            <div className="result-card">
              <div className="result-header">
                <div className="result-icon">
                  <Brain size={24} />
                </div>
                <h3>{t('intelligence.analysis_for')} {t('intelligence.seed')} {t('intelligence.stage')} AgriTech</h3>
              </div>
              <p className="result-text">{result.analysis}</p>
              <div className="result-tags">
                <span className="tag success">{t('intelligence.high_eligibility')}</span>
                <span className="tag info">{t('intelligence.drone_pli')}</span>
              </div>
            </div>

            {/* Matched Investors */}
            <div className="result-section">
              <div className="section-header">
                <div className="section-title">
                  <Users size={20} />
                  <h3>{t('intelligence.matched_investors')}</h3>
                </div>
                <a href="#" className="view-link">
                  {t('intelligence.view_all')} (12) <ExternalLink size={14} />
                </a>
              </div>
              <div className="investors-grid">
                {result.investors.map((investor, index) => (
                  <div key={index} className="investor-card">
                    <div className="investor-avatar">
                      {investor.name.charAt(0)}
                    </div>
                    <div className="investor-info">
                      <h4>{investor.name}</h4>
                      <p className="investor-type">{investor.type} • {investor.location}</p>
                      <div className="investor-details">
                        <div className="detail-item">
                          <span className="detail-label">Ticket Size</span>
                          <span className="detail-value">{investor.ticketSize}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Focus</span>
                          <span className="detail-value">{investor.focus}</span>
                        </div>
                      </div>
                    </div>
                    <button className="investor-action">→</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Schemes */}
            <div className="result-section">
              <div className="section-header">
                <div className="section-title">
                  <FileText size={20} />
                  <h3>{t('intelligence.govt_schemes')}</h3>
                </div>
              </div>
              <div className="schemes-list">
                {result.schemes.map((scheme, index) => (
                  <div key={index} className="scheme-card">
                    <div className="scheme-header">
                      <h4>{scheme.name}</h4>
                      <span className={`scheme-badge ${scheme.type === 'GRANT' ? 'grant' : 'debt'}`}>
                        {scheme.type}
                      </span>
                    </div>
                    <p>{scheme.description}</p>
                    <button className="check-eligibility-btn">
                      {scheme.eligibility} →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="sources-section">
              <FileText size={16} />
              <span>
                <strong>{t('intelligence.sources_label')}</strong> {result.sources.join(', ')}
              </span>
            </div>

            {/* Feedback Section */}
            <div className="feedback-section">
              <h4>Was this helpful?</h4>
              <div className="feedback-buttons">
                <button 
                  className={`feedback-btn ${feedback === 'positive' ? 'active' : ''}`}
                  onClick={() => handleFeedback(true)}
                  disabled={feedback !== null}
                >
                  <ThumbsUp size={18} />
                  {feedback === 'positive' ? 'Thanks!' : 'Yes'}
                </button>
                <button 
                  className={`feedback-btn ${feedback === 'negative' ? 'active' : ''}`}
                  onClick={() => handleFeedback(false)}
                  disabled={feedback !== null}
                >
                  <ThumbsDown size={18} />
                  {feedback === 'negative' ? 'Thanks for feedback' : 'No'}
                </button>
              </div>
            </div>

            {/* Document References Section */}
            {result.documents && result.documents.length > 0 && (
              <div className="document-references-section">
                <div className="section-header">
                  <div className="section-title">
                    <BookOpen size={20} />
                    <h3>{t('intelligence.document_references')}</h3>
                  </div>
                </div>
                <div className="references-list">
                  {result.documents.map((doc, index) => (
                    <div key={index} className="reference-card">
                      <div className="reference-header">
                        <span className="reference-number">#{index + 1}</span>
                        <span className="reference-source">{doc.metadata.source}</span>
                        <span className="reference-score">
                          {t('intelligence.relevance')}: {(doc.relevanceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="reference-content">{doc.content}</p>
                      <div className="reference-meta">
                        {t('intelligence.section')} {doc.metadata.chunkIndex + 1} {t('intelligence.of')} {doc.metadata.totalChunks}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligencePage;

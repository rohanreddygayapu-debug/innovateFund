import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, MapPin, DollarSign, Building, ExternalLink, ChevronDown, Grid, List, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateBatch } from '../utils/translationService';
import TransliteratedInput from '../components/TransliteratedInput';

const InvestorsPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeFilters, setActiveFilters] = useState({
    sectors: [],
    stages: [],
    ticketSizeMin: 0,
    ticketSizeMax: 5000000,
    location: '',
  });
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [allInvestors, setAllInvestors] = useState([]);
  const [originalInvestors, setOriginalInvestors] = useState([]); // Store original data

  // Function to translate investor data
  const translateInvestorsData = async (investors, targetLanguage) => {
    if (targetLanguage === 'en') {
      return investors; // No translation needed for English
    }

    try {
      // Collect all text fields to translate
      const textsToTranslate = [];
      const textMapping = [];

      investors.forEach((investor, idx) => {
        // Translate location, type, and stage fields
        textsToTranslate.push(investor.location);
        textMapping.push({ idx, field: 'location', index: textsToTranslate.length - 1 });

        textsToTranslate.push(investor.type);
        textMapping.push({ idx, field: 'type', index: textsToTranslate.length - 1 });

        // Translate stage array
        investor.stage.forEach((stg, stgIdx) => {
          textsToTranslate.push(stg);
          textMapping.push({ idx, field: 'stage', stageIdx: stgIdx, index: textsToTranslate.length - 1 });
        });

        // Translate sectors array
        investor.sectors.forEach((sector, sectorIdx) => {
          textsToTranslate.push(sector);
          textMapping.push({ idx, field: 'sectors', sectorIdx: sectorIdx, index: textsToTranslate.length - 1 });
        });
      });

      // Translate all texts in batch
      const translatedTexts = await translateBatch(textsToTranslate, targetLanguage, 'en');

      // Create translated investors array
      const translatedInvestors = investors.map(inv => ({...inv, stage: [...inv.stage], sectors: [...inv.sectors]}));

      // Apply translations
      textMapping.forEach(mapping => {
        const translatedText = translatedTexts[mapping.index];
        if (mapping.field === 'stage') {
          translatedInvestors[mapping.idx].stage[mapping.stageIdx] = translatedText;
        } else if (mapping.field === 'sectors') {
          translatedInvestors[mapping.idx].sectors[mapping.sectorIdx] = translatedText;
        } else {
          translatedInvestors[mapping.idx][mapping.field] = translatedText;
        }
      });

      return translatedInvestors;
    } catch (error) {
      console.error('Error translating investor data:', error);
      return investors; // Return original data if translation fails
    }
  };

  // Load investors data
  useEffect(() => {
    // In production, this would fetch from API
    // For now, using the static data structure matching our JSON file
    const investorsData = [
      {
        id: 1,
        name: 'Sequoia Capital',
        location: 'Menlo Park, CA',
        type: 'VC Firm',
        ticketSize: '$1M - $10M',
        stage: ['Seed', 'Series A'],
        sectors: ['SaaS', 'Fintech', 'Enterprise'],
        investments: ['Stripe', 'Airbnb', 'Zoom'],
        matchPercentage: 98,
      },
      {
        id: 2,
        name: 'a16z',
        location: 'Menlo Park, CA',
        type: 'VC Firm',
        ticketSize: '$500k - $25M',
        stage: ['All Stages'],
        sectors: ['Crypto', 'Bio', 'Consumer'],
        investments: ['Coinbase', 'Roblox'],
        matchPercentage: 94,
      },
      {
        id: 3,
        name: 'Y Combinator',
        location: 'Mountain View, CA',
        type: 'Accelerator',
        ticketSize: '$125k - $500k',
        stage: ['Pre-Seed'],
        sectors: ['Agnostic', 'Accelerator'],
        investments: ['Dropbox', 'Reddit'],
        matchPercentage: 88,
      },
      {
        id: 4,
        name: 'Lightspeed',
        location: 'Global',
        type: 'VC Firm',
        ticketSize: '$1M - $50M',
        stage: ['Multi-stage'],
        sectors: ['Enterprise', 'Consumer'],
        investments: ['Snap', 'Affirm'],
        matchPercentage: 85,
      },
      {
        id: 5,
        name: 'Index Ventures',
        location: 'London / SF',
        type: 'VC Firm',
        ticketSize: '$2M - $20M',
        stage: ['Seed', 'IPO'],
        sectors: ['Gaming', 'Fintech'],
        investments: ['Discord', 'Figma'],
        matchPercentage: 78,
      },
      {
        id: 6,
        name: 'Founders Fund',
        location: 'San Francisco',
        type: 'VC Firm',
        ticketSize: '$3M - $15M',
        stage: ['Series A+'],
        sectors: ['Deep Tech', 'Space'],
        investments: ['SpaceX', 'Palantir'],
        matchPercentage: 65,
      },
      {
        id: 7,
        name: 'Accel India',
        location: 'Bangalore',
        type: 'VC Firm',
        ticketSize: '₹5Cr - ₹50Cr',
        stage: ['Seed', 'Series A', 'Series B'],
        sectors: ['SaaS', 'E-commerce', 'HealthTech', 'AI'],
        investments: ['Freshworks', 'Swiggy', 'Urban Company', 'BrowserStack'],
        matchPercentage: 92,
      },
      {
        id: 8,
        name: 'Blume Ventures',
        location: 'Mumbai',
        type: 'Early Stage VC',
        ticketSize: '₹1Cr - ₹10Cr',
        stage: ['Seed', 'Pre-Series A'],
        sectors: ['DeepTech', 'AI', 'AgriTech', 'EdTech'],
        investments: ['GreyOrange', 'Dunzo', 'Purplle', 'Exotel'],
        matchPercentage: 87,
      },
      {
        id: 9,
        name: 'Matrix Partners India',
        location: 'Bangalore',
        type: 'VC Firm',
        ticketSize: '₹3Cr - ₹30Cr',
        stage: ['Seed', 'Series A'],
        sectors: ['SaaS', 'AI', 'FinTech', 'Consumer Tech'],
        investments: ['Ola', 'Dailyhunt', 'Quinto', 'Whitehat Jr'],
        matchPercentage: 89,
      },
    ];
    
    setOriginalInvestors(investorsData);
    setAllInvestors(investorsData);
    setFilteredInvestors(investorsData);
  }, []);

  // Translate investors data when language changes
  useEffect(() => {
    const translateData = async () => {
      if (originalInvestors.length > 0) {
        const translated = await translateInvestorsData(originalInvestors, language);
        setAllInvestors(translated);
        setFilteredInvestors(translated);
      }
    };
    translateData();
  }, [language, originalInvestors]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allInvestors];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(inv =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.sectors.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sector filter
    if (activeFilters.sectors.length > 0) {
      filtered = filtered.filter(inv =>
        activeFilters.sectors.some(sector => inv.sectors.includes(sector))
      );
    }

    // Stage filter
    if (activeFilters.stages.length > 0) {
      filtered = filtered.filter(inv =>
        activeFilters.stages.some(stage => inv.stage.includes(stage))
      );
    }

    setFilteredInvestors(filtered);
  }, [searchTerm, activeFilters, allInvestors]);

  const toggleSectorFilter = (sector) => {
    setActiveFilters(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const toggleStageFilter = (stage) => {
    setActiveFilters(prev => ({
      ...prev,
      stages: prev.stages.includes(stage)
        ? prev.stages.filter(s => s !== stage)
        : [...prev.stages, stage]
    }));
  };

  const removeFilter = (type, value) => {
    if (type === 'sector') {
      toggleSectorFilter(value);
    } else if (type === 'stage') {
      toggleStageFilter(value);
    }
  };

  const resetFilters = () => {
    setActiveFilters({
      sectors: [],
      stages: [],
      ticketSizeMin: 0,
      ticketSizeMax: 5000000,
      location: '',
    });
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return '#10B981'; // green
    if (percentage >= 80) return '#F59E0B'; // yellow
    return '#6B7280'; // gray
  };

  return (
    <div className="investors-page-modern">
      {/* Sidebar Filters */}
      <aside className="investors-sidebar">
        <div className="sidebar-header">
          <h3>{t('investors.filters')}</h3>
          <button className="reset-filters" onClick={resetFilters}>{t('investors.reset_all')}</button>
        </div>

        {/* Active Filters */}
        {(activeFilters.sectors.length > 0 || activeFilters.stages.length > 0) && (
          <div className="active-filters">
            <p className="filter-label">{t('investors.refine_search')}</p>
            <div className="filter-tags">
              {activeFilters.sectors.map(sector => (
                <span key={sector} className="filter-tag">
                  {sector}
                  <X size={14} onClick={() => removeFilter('sector', sector)} />
                </span>
              ))}
              {activeFilters.stages.map(stage => (
                <span key={stage} className="filter-tag">
                  {stage}
                  <X size={14} onClick={() => removeFilter('stage', stage)} />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sector Filter */}
        <div className="filter-section">
          <button className="filter-section-header">
            <span>{t('investors.sector')}</span>
            <ChevronDown size={18} />
          </button>
          <div className="filter-options">
            {['SaaS', 'Fintech', 'AI', 'HealthTech', 'E-commerce', 'DeepTech'].map(sector => (
              <label key={sector} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={activeFilters.sectors.includes(sector)}
                  onChange={() => toggleSectorFilter(sector)}
                />
                <span>{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ticket Size Filter */}
        <div className="filter-section">
          <button className="filter-section-header">
            <span>{t('investors.ticket_size')}</span>
            <ChevronDown size={18} />
          </button>
          <div className="filter-options">
            <div className="ticket-size-inputs">
              <input type="text" placeholder="$100k" value="$100k" readOnly />
              <span>-</span>
              <input type="text" placeholder="$5M+" value="$5M+" readOnly />
            </div>
            <input
              type="range"
              min="0"
              max="5000000"
              value={activeFilters.ticketSizeMax}
              className="ticket-size-slider"
              readOnly
            />
            <div className="ticket-size-labels">
              <span>$100k</span>
              <span>$2M</span>
              <span>$5M+</span>
            </div>
          </div>
        </div>

        {/* Geography Filter */}
        <div className="filter-section">
          <button className="filter-section-header">
            <span>{t('investors.geography')}</span>
            <ChevronDown size={18} />
          </button>
          <div className="filter-options">
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>{t('investors.united_states')}</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>{t('investors.india')}</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" />
              <span>{t('investors.europe')}</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="investors-main">
        {/* Header */}
        <div className="investors-header">
          <div>
            <h1>{t('investors.find_next_investor')}</h1>
            <p>{t('investors.access_data')}</p>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="investors-controls">
          <div className="search-bar">
            <Search size={20} />
            <TransliteratedInput
              type="text"
              placeholder={t('investors.search_firm_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="controls-right">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">{t('investors.relevance')}</option>
              <option value="match">{t('investors.match_percent')}</option>
              <option value="name">{t('investors.name')}</option>
            </select>
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <span className="results-count">{filteredInvestors.length} {t('investors.investors_found')}</span>
          <span className="results-sort">{t('investors.sorted_by')} {sortBy}</span>
        </div>

        {/* Investors Grid/List */}
        <div className={`investors-grid-modern ${viewMode === 'list' ? 'list-view' : ''}`}>
          {filteredInvestors.map((investor) => (
            <div key={investor.id} className="investor-card-modern">
              {/* Card Header */}
              <div className="card-header">
                <div className="investor-identity">
                  <div className="investor-logo-modern">
                    {investor.name.charAt(0)}
                  </div>
                  <div className="investor-info-modern">
                    <h3>{investor.name}</h3>
                    <p className="investor-location">
                      <MapPin size={14} />
                      {investor.location}
                    </p>
                  </div>
                </div>
                <div
                  className="match-badge"
                  style={{ backgroundColor: getMatchColor(investor.matchPercentage) }}
                >
                  {investor.matchPercentage}% {t('investors.match')}
                </div>
              </div>

              {/* Sectors Tags */}
              <div className="investor-sectors">
                {investor.sectors.map((sector, idx) => (
                  <span key={idx} className="sector-tag">{sector}</span>
                ))}
              </div>

              {/* Investment Details */}
              <div className="investor-details-grid">
                <div className="detail-item">
                  <span className="detail-label">{t('investors.ticket_size')}</span>
                  <span className="detail-value">{investor.ticketSize}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t('investors.stage')}</span>
                  <span className="detail-value">{investor.stage.join(', ')}</span>
                </div>
              </div>

              {/* Past Investments */}
              <div className="past-investments-section">
                <span className="detail-label">{t('investors.past_investments')}</span>
                <p className="investments-list">
                  {investor.investments.join(', ')}
                </p>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <button className="btn-view-profile">{t('investors.view_profile')}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredInvestors.length >= 9 && (
          <div className="load-more-section">
            <button 
              className="btn-load-more"
              onClick={() => alert('Load more functionality would fetch additional investors from the API')}
            >
              {t('investors.load_more')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default InvestorsPage;

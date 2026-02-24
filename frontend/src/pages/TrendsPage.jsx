import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateBatch } from '../utils/translationService';

// Original data stored outside component to avoid unnecessary re-renders
const originalSectorData = [
  { sector: 'FinTech', funding: '₹12,450 Cr', growth: '+45%', color: '#4F46E5' },
  { sector: 'HealthTech', funding: '₹8,230 Cr', growth: '+32%', color: '#10B981' },
  { sector: 'EdTech', funding: '₹6,780 Cr', growth: '+18%', color: '#F59E0B' },
  { sector: 'E-commerce', funding: '₹15,340 Cr', growth: '+12%', color: '#EF4444' },
  { sector: 'SaaS', funding: '₹9,120 Cr', growth: '+38%', color: '#8B5CF6' },
];

const originalRegionalData = [
  { region: 'South India', share: '42%', amount: '₹18,500 Cr' },
  { region: 'North India', share: '35%', amount: '₹15,400 Cr' },
  { region: 'West India', share: '18%', amount: '₹7,920 Cr' },
  { region: 'East India', share: '5%', amount: '₹2,200 Cr' },
];

const TrendsPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  const [sectorData, setSectorData] = useState(originalSectorData);
  const [regionalData, setRegionalData] = useState(originalRegionalData);

  // Translate data when language changes
  useEffect(() => {
    const translateData = async () => {
      if (language === 'en') {
        setSectorData(originalSectorData);
        setRegionalData(originalRegionalData);
        return;
      }

      try {
        // Translate sector data
        const sectorTexts = originalSectorData.map(item => item.sector);
        const translatedSectors = await translateBatch(sectorTexts, language, 'en');
        const translatedSectorData = originalSectorData.map((item, idx) => ({
          ...item,
          sector: translatedSectors[idx],
        }));
        setSectorData(translatedSectorData);

        // Translate regional data
        const regionTexts = originalRegionalData.map(item => item.region);
        const translatedRegions = await translateBatch(regionTexts, language, 'en');
        const translatedRegionalData = originalRegionalData.map((item, idx) => ({
          ...item,
          region: translatedRegions[idx],
        }));
        setRegionalData(translatedRegionalData);
      } catch (error) {
        console.error('Error translating trends data:', error);
      }
    };

    translateData();
  }, [language]);

  return (
    <div className="trends-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('trends.title')}</h1>
          <p>{t('trends.subtitle')}</p>
        </div>

        {/* Key Stats */}
        <div className="stats-grid-4">
          <div className="stat-card">
            <div className="stat-icon primary">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('trends.total_funding_label')}</span>
              <span className="stat-value">{t('trends.total_funding_value')}</span>
              <span className="stat-change positive">{t('trends.total_funding_change')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('trends.active_deals_label')}</span>
              <span className="stat-value">{t('trends.active_deals_value')}</span>
              <span className="stat-change positive">{t('trends.active_deals_change')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('trends.avg_deal_size_label')}</span>
              <span className="stat-value">{t('trends.avg_deal_size_value')}</span>
              <span className="stat-change positive">{t('trends.avg_deal_size_change')}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon info">
              <PieChart size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('trends.unicorns_label')}</span>
              <span className="stat-value">{t('trends.unicorns_value')}</span>
              <span className="stat-change">{t('trends.unicorns_change')}</span>
            </div>
          </div>
        </div>

        {/* Sector-wise Funding */}
        <div className="trends-section">
          <h2>{t('trends.sector_funding')}</h2>
          <div className="ai-insight">
            <span className="ai-badge">{t('trends.ai_badge')}</span>
            <p>
              {t('trends.sector_insight')}
            </p>
          </div>

          <div className="sector-chart">
            {sectorData.map((item, index) => (
              <div key={index} className="sector-row">
                <div className="sector-info">
                  <span className="sector-name">{item.sector}</span>
                  <span className="sector-amount">{item.funding}</span>
                </div>
                <div className="sector-bar-container">
                  <div
                    className="sector-bar"
                    style={{
                      width: `${parseInt(item.growth)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="sector-growth">{item.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="trends-section">
          <h2>{t('trends.regional')}</h2>
          <div className="ai-insight">
            <span className="ai-badge">{t('trends.ai_badge')}</span>
            <p>
              {t('trends.regional_insight')}
            </p>
          </div>

          <div className="regional-grid">
            {regionalData.map((item, index) => (
              <div key={index} className="regional-card">
                <div className="regional-header">
                  <h4>{item.region}</h4>
                  <span className="regional-share">{item.share}</span>
                </div>
                <p className="regional-amount">{item.amount}</p>
                <div className="regional-bar">
                  <div
                    className="regional-fill"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Year-wise Growth */}
        <div className="trends-section">
          <h2>{t('trends.year_growth')}</h2>
          <div className="years-chart">
            <div className="chart-visual">
              {[2020, 2021, 2022, 2023, 2024].map((year, i) => {
                const heights = ['40%', '55%', '48%', '62%', '85%'];
                const values = ['₹28K Cr', '₹38K Cr', '₹33K Cr', '₹41K Cr', '₹52K Cr'];
                return (
                  <div key={year} className="year-bar">
                    <div
                      className="bar-fill"
                      style={{ height: heights[i] }}
                    >
                      <span className="bar-value">{values[i]}</span>
                    </div>
                    <span className="bar-label">{year}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;

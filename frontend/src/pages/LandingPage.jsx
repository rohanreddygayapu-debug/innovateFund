import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Globe, Brain, TrendingUp, Building, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="badge">{t('landing.badge')}</div>
          <h1 className="hero-title">
            {t('landing.hero_title')}{' '}
            <span className="gradient-text">{t('landing.hero_title_highlight')}</span>
          </h1>
          <p className="hero-description">
            {t('landing.hero_description')}
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary btn-large">
              {t('landing.try_demo')} <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn-secondary btn-large">
              {t('landing.learn_more')}
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <CheckCircle size={16} />
              <span>{t('landing.free_start')}</span>
            </div>
            <div className="hero-feature">
              <CheckCircle size={16} />
              <span>{t('landing.no_card')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">{t('landing.why_choose')}</h2>
          <p className="section-subtitle">
            {t('landing.why_subtitle')}
          </p>

          <div className="cards-grid">
            <div className="feature-card problem-card">
              <div className="card-icon red">
                <Globe />
              </div>
              <h3>{t('landing.problem_title')}</h3>
              <p>
                {t('landing.problem_description')}
              </p>
            </div>

            <div className="feature-card solution-card">
              <div className="card-icon blue">
                <Brain />
              </div>
              <h3>{t('landing.solution_title')}</h3>
              <p>
                {t('landing.solution_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="capabilities-section">
        <div className="container">
          <h2 className="section-title">{t('landing.key_capabilities')}</h2>
          <p className="section-subtitle">
            {t('landing.capabilities_subtitle')}
          </p>

          <div className="cards-grid-3">
            <div className="capability-card">
              <div className="card-icon-small">
                <Globe className="icon-gradient-1" />
              </div>
              <h3>{t('landing.multilingual_search')}</h3>
              <p>
                {t('landing.multilingual_description')}
              </p>
            </div>

            <div className="capability-card">
              <div className="card-icon-small">
                <Brain className="icon-gradient-2" />
              </div>
              <h3>{t('landing.ai_insights')}</h3>
              <p>
                {t('landing.ai_description')}
              </p>
            </div>

            <div className="capability-card">
              <div className="card-icon-small">
                <TrendingUp className="icon-gradient-3" />
              </div>
              <h3>{t('landing.investor_matching')}</h3>
              <p>
                {t('landing.investor_description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience-section">
        <div className="container">
          <div className="experience-content">
            <div className="experience-text">
              <h2>{t('landing.experience_title')}</h2>
              <p>
                {t('landing.experience_description')}
              </p>
              <ul className="feature-list">
                <li>
                  <CheckCircle size={20} />
                  <span>{t('landing.experience_feature_1')}</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>{t('landing.experience_feature_2')}</span>
                </li>
                <li>
                  <CheckCircle size={20} />
                  <span>{t('landing.experience_feature_3')}</span>
                </li>
              </ul>
              <Link to="/signup" className="btn-primary">
                {t('landing.start_free_search')} <ArrowRight size={20} />
              </Link>
            </div>
            <div className="experience-visual">
              <div className="visual-card">
                <div className="visual-header">
                  <div className="visual-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                </div>
                <div className="visual-content">
                  <div className="query-box">
                    <div className="query-icon">💬</div>
                    <p>{t('landing.visual_query_text')}</p>
                    <span className="query-lang">{t('landing.visual_query_lang')}</span>
                  </div>
                  <div className="response-preview">
                    <div className="ai-badge">
                      <Brain size={16} />
                      {t('landing.visual_ai_badge')}
                    </div>
                    <p className="response-text">
                      {t('landing.visual_response_text')}
                    </p>
                    <button className="view-details-btn">
                      {t('landing.view_details')} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('landing.cta_title')}</h2>
            <p>
              {t('landing.cta_description')}
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary btn-large">
                {t('landing.create_account')}
              </Link>
              <Link to="/login" className="btn-secondary btn-large">
                {t('landing.sign_in')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

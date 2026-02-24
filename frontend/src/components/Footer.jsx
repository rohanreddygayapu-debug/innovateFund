import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">FI</div>
              <span className="logo-text">{t('app.name')}</span>
            </div>
            <p className="footer-description">
              {t('footer.description')}
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Github size={20} /></a>
              <a href="#" className="social-link"><Twitter size={20} /></a>
              <a href="#" className="social-link"><Linkedin size={20} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>{t('footer.platform')}</h4>
            <ul>
              <li><Link to="/investors">{t('footer.platform_search_funding')}</Link></li>
              <li><Link to="/investors">{t('footer.platform_investor_database')}</Link></li>
              <li><Link to="/policies">{t('footer.platform_government_grants')}</Link></li>
              <li><Link to="/intelligence">{t('footer.platform_ai_insights')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.resources')}</h4>
            <ul>
              <li><a href="#">{t('footer.resources_blog')}</a></li>
              <li><a href="#">{t('footer.resources_success_stories')}</a></li>
              <li><a href="#">{t('footer.resources_help_center')}</a></li>
              <li><a href="#">{t('footer.resources_api_docs')}</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{t('footer.company')}</h4>
            <ul>
              <li><Link to="/about">{t('footer.company_about_us')}</Link></li>
              <li><a href="#">{t('footer.company_careers')}</a></li>
              <li><a href="#">{t('footer.company_legal')}</a></li>
              <li><a href="#">{t('footer.company_contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t('app.name')}. {t('footer.all_rights_reserved')}</p>
          <div className="footer-links">
            <a href="#">{t('footer.privacy_policy')}</a>
            <a href="#">{t('footer.terms_of_service')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

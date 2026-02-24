import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, languages, isTranslating } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = async (langCode) => {
    setShowLangDropdown(false);
    await setLanguage(langCode);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="logo">
          <div className="logo-icon">FI</div>
          <span className="logo-text">{t('app.name')}</span>
        </Link>

        <nav className="nav-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">{t('header.dashboard')}</Link>
              <Link to="/intelligence" className="nav-link">{t('header.intelligence')}</Link>
            </>
          ) : (
            <>
              <a href="#features" className="nav-link">{t('header.features')}</a>
              <a href="#pricing" className="nav-link">{t('header.pricing')}</a>
              <a href="#about" className="nav-link">{t('header.about')}</a>
            </>
          )}
        </nav>

        <div className="header-actions">
          {/* Language Selector */}
          <div className="language-selector">
            <button 
              className="language-btn"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              disabled={isTranslating}
            >
              <Globe size={18} />
              <span>{isTranslating ? t('header.loading') : languages.find(l => l.code === language)?.name.split(' ')[0] || 'EN'}</span>
            </button>
            {showLangDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={isTranslating}
                  >
                    <span className="flag">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <button className="icon-btn">
                <Bell size={20} />
              </button>
              
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} />
                      <span>{t('header.profile')}</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <Settings size={16} />
                      <span>{t('header.settings')}</span>
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      <LogOut size={16} />
                      <span>{t('header.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">{t('header.log_in')}</Link>
              <Link to="/signup" className="btn-primary">{t('header.sign_up')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

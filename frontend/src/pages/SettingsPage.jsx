import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Lock, User, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languages } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  return (
    <div className="settings-page">
      <div className="container">
        <div className="page-header">
          <SettingsIcon size={32} />
          <div>
            <h1>{t('settings.title')}</h1>
            <p>{t('settings.subtitle')}</p>
          </div>
        </div>

        <div className="settings-content">
          {/* Theme Settings */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3>{t('settings.appearance')}</h3>
                <p>{t('settings.appearance_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.theme')}</h4>
                <p>{t('settings.theme_desc')}</p>
              </div>
              <button 
                className={`theme-toggle ${theme}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <span className="theme-toggle-slider">
                  {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                </span>
                <span className="theme-label">{theme === 'dark' ? t('settings.dark') : t('settings.light')}</span>
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <Globe size={20} />
              </div>
              <div>
                <h3>{t('settings.language_settings')}</h3>
                <p>{t('settings.language_settings_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.display_language')}</h4>
                <p>{t('settings.display_language_desc')}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="settings-select"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <Bell size={20} />
              </div>
              <div>
                <h3>{t('settings.notifications')}</h3>
                <p>{t('settings.notifications_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.push_notifications')}</h4>
                <p>{t('settings.push_notifications_desc')}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.email_updates')}</h4>
                <p>{t('settings.email_updates_desc')}</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <Lock size={20} />
              </div>
              <div>
                <h3>{t('settings.security')}</h3>
                <p>{t('settings.security_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.change_password')}</h4>
                <p>{t('settings.change_password_desc')}</p>
              </div>
              <button className="btn-secondary btn-sm">{t('settings.change_button')}</button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.enable_2fa')}</h4>
                <p>{t('settings.enable_2fa_desc')}</p>
              </div>
              <button className="btn-secondary btn-sm">{t('settings.enable_button')}</button>
            </div>
          </div>

          {/* Account */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <User size={20} />
              </div>
              <div>
                <h3>{t('settings.account')}</h3>
                <p>{t('settings.account_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.delete_account')}</h4>
                <p>{t('settings.delete_account_desc')}</p>
              </div>
              <button className="btn-danger btn-sm">{t('settings.delete_button')}</button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div className="settings-icon">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3>{t('settings.help')}</h3>
                <p>{t('settings.help_desc')}</p>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.documentation')}</h4>
                <p>{t('settings.documentation_desc')}</p>
              </div>
              <button className="btn-secondary btn-sm">{t('settings.view_docs_button')}</button>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <h4>{t('settings.contact_support')}</h4>
                <p>{t('settings.contact_support_desc')}</p>
              </div>
              <button className="btn-secondary btn-sm">{t('settings.contact_button')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

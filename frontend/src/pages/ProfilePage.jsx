import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, MapPin, Building, Briefcase, Save } from 'lucide-react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, setLanguage, languages } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex',
    email: user?.email || 'alex@example.com',
    userType: user?.userType || 'founder',
    domain: user?.domain || 'AgriTech',
    stage: user?.stage || 'seed',
    location: user?.location || 'Karnataka',
    preferredLanguage: language,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLanguage(formData.preferredLanguage);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.subtitle')}</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {formData.name.charAt(0)}
              </div>
              <h3>{formData.name}</h3>
              <p>{formData.email}</p>
              <button className="btn-secondary btn-sm">{t('profile.change_avatar')}</button>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">24</span>
                <span className="stat-label">{t('profile.queries')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">5</span>
                <span className="stat-label">{t('profile.matches')}</span>
              </div>
            </div>
          </div>

          <div className="profile-form-section">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>{t('profile.personal_info')}</h3>

                <div className="form-group">
                  <label htmlFor="name">{t('profile.full_name')}</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('profile.email_address')}</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">{t('profile.location')}</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder={t('profile.location_placeholder')}
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t('profile.startup_info')}</h3>

                <div className="form-group">
                  <label htmlFor="userType">{t('profile.i_am_a')}</label>
                  <div className="input-wrapper">
                    <Briefcase size={18} className="input-icon" />
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="founder">{t('profile.founder')}</option>
                      <option value="investor">{t('profile.investor')}</option>
                      <option value="student">{t('profile.student')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="domain">{t('profile.domain')}</label>
                  <div className="input-wrapper">
                    <Building size={18} className="input-icon" />
                    <select
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="AgriTech">{t('profile.agritech')}</option>
                      <option value="FinTech">{t('profile.fintech')}</option>
                      <option value="HealthTech">{t('profile.healthtech')}</option>
                      <option value="EdTech">{t('profile.edtech')}</option>
                      <option value="SaaS">{t('profile.saas')}</option>
                      <option value="E-commerce">{t('profile.ecommerce')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="stage">{t('profile.funding_stage')}</label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="idea">{t('profile.idea')}</option>
                    <option value="seed">{t('profile.seed')}</option>
                    <option value="series-a">{t('profile.series_a')}</option>
                    <option value="series-b">{t('profile.series_b')}</option>
                    <option value="growth">{t('profile.growth')}</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h3>{t('profile.preferences')}</h3>

                <div className="form-group">
                  <label htmlFor="preferredLanguage">{t('profile.language')}</label>
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    {t('profile.language_hint')}
                  </p>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary">{t('profile.cancel')}</button>
                <button type="submit" className="btn-primary">
                  <Save size={18} />
                  {t('profile.save_changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

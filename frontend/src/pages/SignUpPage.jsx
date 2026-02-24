import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, User, Mail } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'founder',
    preferredLanguage: language,
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    // In a real app, this would call an API
    signup(formData);
    setLanguage(formData.preferredLanguage);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>{t('auth.join_network')}</h1>
            <p>{t('auth.join_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* User Type Selection */}
            <div className="form-group">
              <label>{t('auth.user_type_optional')}</label>
              <div className="user-type-selector">
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'founder' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'founder' }))}
                >
                  {t('auth.founder')}
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'investor' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'investor' }))}
                >
                  {t('auth.investor')}
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.userType === 'student' ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
                >
                  {t('auth.student')}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">{t('auth.full_name')}</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('auth.name_placeholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email or Phone */}
            <div className="form-group">
              <label htmlFor="email">{t('auth.phone_or_email')}</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder={t('auth.email_or_phone_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={t('auth.password_min_placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="form-group">
              <label htmlFor="preferredLanguage">{t('auth.preferred_language')}</label>
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
            </div>

            {/* Terms Agreement */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span>
                  {t('auth.terms_agreement_prefix')}{' '}
                  <a href="#" className="link-primary">{t('auth.terms_service')}</a>{' '}
                  {t('auth.terms_agreement_middle')}{' '}
                  <a href="#" className="link-primary">{t('auth.privacy_policy')}</a>
                  {t('auth.terms_agreement_suffix')}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary btn-full">
              {t('auth.create_account')}
            </button>

            {/* Social Sign Up */}
            <div className="divider">
              <span>{t('auth.social_login_uppercase')}</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="btn-social">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                {t('auth.google')}
              </button>
              <button type="button" className="btn-social">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="#0077B5">
                  <path d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM5.3 15.3H2.7V7h2.6v8.3zM4 5.9c-.8 0-1.5-.7-1.5-1.5S3.2 2.9 4 2.9s1.5.7 1.5 1.5S4.8 5.9 4 5.9zM15.3 15.3h-2.6V11c0-1-.4-1.7-1.3-1.7-.7 0-1.1.5-1.3 1v5h-2.6V7h2.6v1.2c.3-.5 1-1.2 2.4-1.2 1.7 0 3 1.1 3 3.5v5.8z"/>
                </svg>
                {t('auth.linkedin')}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              {t('auth.have_account')}{' '}
              <Link to="/login" className="link-primary">{t('auth.log_in')}</Link>
            </p>
          </div>
        </div>

        <div className="auth-sidebar">
          <div className="sidebar-content">
            <p className="sidebar-copyright">© {new Date().getFullYear()} {t('app.name')}. {t('auth.sidebar_copyright')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

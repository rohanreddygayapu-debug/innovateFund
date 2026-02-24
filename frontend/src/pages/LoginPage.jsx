import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, TrendingUp, Globe } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would call an API
    login({
      name: 'Alex',
      email: formData.email,
    });
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>{t('auth.welcome_back')}</h1>
            <p>{t('auth.welcome_subtitle')}</p>
          </div>

          {/* Login Method Tabs */}
          <div className="auth-tabs">
            <button
              className={`tab-btn ${loginMethod === 'password' ? 'active' : ''}`}
              onClick={() => setLoginMethod('password')}
            >
              {t('auth.password_tab')}
            </button>
            <button
              className={`tab-btn ${loginMethod === 'otp' ? 'active' : ''}`}
              onClick={() => setLoginMethod('otp')}
            >
              {t('auth.otp_tab')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Address */}
            <div className="form-group">
              <label htmlFor="email">{t('auth.email_address')}</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('auth.email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {loginMethod === 'password' ? (
              <>
                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password">{t('auth.password')}</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder={t('auth.password_placeholder')}
                      value={formData.password}
                      onChange={handleChange}
                      required
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

                {/* Remember Me & Forgot Password */}
                <div className="form-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>{t('auth.remember_me')}</span>
                  </label>
                  <Link to="/forgot-password" className="link-primary">
                    {t('auth.forgot_password')}
                  </Link>
                </div>
              </>
            ) : (
              <div className="form-group">
                <p className="form-hint">
                  {t('auth.otp_message')}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn-primary btn-full">
              {t('auth.sign_in')}
            </button>

            {/* Social Login */}
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
              {t('auth.no_account')}{' '}
              <Link to="/signup" className="link-primary">{t('auth.contact_sales')}</Link>
            </p>
          </div>
        </div>

        <div className="auth-sidebar login-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-icon">
              <Globe size={48} />
            </div>
            <h2>{t('auth.sidebar_intelligence')}</h2>
            <p>
              {t('auth.sidebar_description')}
            </p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-label">{t('auth.sidebar_market_trend')}</div>
                <div className="stat-value">+124%</div>
                <div className="stat-desc">{t('auth.sidebar_growth')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Globe size={24} />
                </div>
                <div className="stat-label">{t('auth.sidebar_languages')}</div>
                <div className="stat-value">12</div>
                <div className="stat-desc">{t('auth.sidebar_supported')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

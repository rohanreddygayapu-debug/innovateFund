import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Users, 
  TrendingUp, 
  FileText, 
  Clock, 
  Database,
  BarChart2,
  Shield
} from 'lucide-react';
import TransliteratedInput from '../components/TransliteratedInput';
import { useState } from 'react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const recentActivity = [
    {
      id: 1,
      title: 'Valuation multiples SaaS 2024',
      status: t('dashboard.analysis_ready'),
      time: '2 hours ago',
      icon: <Clock size={20} />,
    },
    {
      id: 2,
      title: 'Top AI Investors in Berlin',
      status: t('dashboard.analysis_ready'),
      time: 'Yesterday',
      icon: <Clock size={20} />,
    },
    {
      id: 3,
      title: 'Deep Tech Grants France Q4',
      status: t('dashboard.processing'),
      time: 'Just now',
      icon: <Clock size={20} />,
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Welcome Section */}
        <div className="dashboard-header">
          <div>
            <h1>{t('dashboard.welcome')}, {user?.name || 'User'}</h1>
            <p>{t('dashboard.welcome_message')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="dashboard-search">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <TransliteratedInput
              type="text"
              placeholder={t('intelligence.placeholder')}
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/intelligence" className="btn-primary">
            {t('dashboard.ask_funding')}
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/investors" className="action-card">
            <div className="card-visual database">
              <Database size={32} />
            </div>
            <div className="card-content">
              <div className="card-badge">{t('dashboard.database_badge')}</div>
              <h3>{t('dashboard.explore_investors')}</h3>
              <p>{t('dashboard.explore_investors_desc')}</p>
            </div>
          </Link>

          <Link to="/trends" className="action-card">
            <div className="card-visual analysis">
              <BarChart2 size={32} />
            </div>
            <div className="card-content">
              <div className="card-badge">{t('dashboard.analysis_badge')}</div>
              <h3>{t('dashboard.view_trends')}</h3>
              <p>{t('dashboard.view_trends_desc')}</p>
            </div>
          </Link>

          <Link to="/policies" className="action-card">
            <div className="card-visual legal">
              <Shield size={32} />
            </div>
            <div className="card-content">
              <div className="card-badge">{t('dashboard.legal_badge')}</div>
              <h3>{t('dashboard.government_policies')}</h3>
              <p>{t('dashboard.government_policies_desc')}</p>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Activity */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>{t('dashboard.recent_activity')}</h2>
              <Link to="/history" className="view-all-link">{t('dashboard.view_all')}</Link>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <div className="activity-meta">
                      <span className={`status ${activity.status === t('dashboard.processing') ? 'processing' : 'ready'}`}>
                        {activity.status}
                      </span>
                      <span className="time">{activity.time}</span>
                    </div>
                  </div>
                  <button className="activity-action">→</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import IntelligencePage from './pages/IntelligencePage';
import InvestorsPage from './pages/InvestorsPage';
import TrendsPage from './pages/TrendsPage';
import PoliciesPage from './pages/PoliciesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// Component to update document title based on current language
const DocumentTitle = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = t('app.title');
  }, [t]);
  
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="app">
      <DocumentTitle />
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/intelligence" element={<ProtectedRoute><IntelligencePage /></ProtectedRoute>} />
          <Route path="/investors" element={<ProtectedRoute><InvestorsPage /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute><TrendsPage /></ProtectedRoute>} />
          <Route path="/policies" element={<ProtectedRoute><PoliciesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

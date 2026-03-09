import React from 'react';
import { ArrowRight, CheckCircle, Clock, Sparkles, TrendingUp, Shield, Zap, Layout } from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  // Use the generated hero image
  const heroImageUrl = "file:///C:/Users/AJAY%20REDDY/.gemini/antigravity/brain/aabef23f-6f63-4b9f-b9c4-1fa2170f4786/focusflow_hero_abstract_1773049981360.png";

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img src={heroImageUrl} alt="FocusFlow Hero" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge">Next-Gen Productivity</span>
          <h1 className="hero-title">Master Your Focus.<br />Elevate Your Grades.</h1>
          <p className="hero-description">
            The all-in-one productivity hub designed specifically for students. 
            Combine science-backed focus techniques with cutting-edge AI assistance.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={onGetStarted}>
              Get Started for Free <ArrowRight size={20} />
            </button>
            <button className="btn-secondary">Explore Features</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Built for Real Students</h2>
          <p className="section-subtitle">Everything you need to crush your OS, DBMS, and DSA exams.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Clock size={32} />
            </div>
            <h3>Pomodoro 2.0</h3>
            <p>Animated circular timers with customizable session lengths. Stay in the zone longer with visual feedback.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Sparkles size={32} />
            </div>
            <h3>AI Study Buddy</h3>
            <p>Integrated Groq-powered AI companion. Ask technical questions or get motivational boosts instantly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp size={32} />
            </div>
            <h3>Smart Progress</h3>
            <p>Visualize your study habits with dynamic progress bars linked directly to your task completion status.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Layout size={32} />
            </div>
            <h3>Focused Workspace</h3>
            <p>A high-end, distraction-free environment with dark mode support. Designed for long late-night study sessions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={32} />
            </div>
            <h3>Firebase Auth</h3>
            <p>Secure login with a premium 3D flip animation. Your data stays yours, synced across all your devices.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={32} />
            </div>
            <h3>Quick Notes</h3>
            <p>Capture thoughts instantly with integrated sticky notes. Auto-saves so you never lose a brilliant idea.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">45%</span>
            <span className="stat-label">Higher Focus</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">2x</span>
            <span className="stat-label">Faster Recall</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Happy Students</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <CheckCircle size={32} className="text-primary" />
          <span>FocusFlow</span>
        </div>
        <div className="footer-links">
          <span>About</span>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FocusFlow. Engineered for excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

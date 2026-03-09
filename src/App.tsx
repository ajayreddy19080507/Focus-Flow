import { useState, useEffect } from 'react';
import { Moon, Sun, Settings, LogOut, CheckCircle } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import './App.css';

// Firebase
import { onAuthStateChanged, type User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from './firebase';

// Components
import PomodoroTimer from './components/PomodoroTimer';
import TaskList from './components/TaskList';
import QuickNotes from './components/QuickNotes';
import ProgressTracker from './components/ProgressTracker';
import MotivationalStreak from './components/MotivationalStreak';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  // App States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [focusTime, setFocusTime] = useState(0); 

  // Auth States
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Check if previously in demo mode via local storage
  useEffect(() => {
    if (localStorage.getItem('focusflow_demo') === 'true') {
      setDemoMode(true);
    }
  }, []);

  const handleLogout = async () => {
    if (demoMode) {
      setDemoMode(false);
      localStorage.removeItem('focusflow_demo');
      return;
    }
    await signOut(auth);
  };

  const handleDemoLogin = () => {
    setDemoMode(true);
    localStorage.setItem('focusflow_demo', 'true');
  };

  // Load Focus Time on Auth state change
  useEffect(() => {
    if (user || demoMode) {
      const savedTime = localStorage.getItem('focusflow_focus_time');
      if (savedTime && !focusTime) {
        setFocusTime(parseInt(savedTime, 10));
      }
    }
  }, [user, demoMode]); // Removed focusTime to prevent loop, checking inside condition instead

  const handleSessionComplete = (minutes: number) => {
    const newTime = focusTime + minutes;
    setFocusTime(newTime);
    localStorage.setItem('focusflow_focus_time', newTime.toString());
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Render Loading
  if (authLoading) {
    return <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}><div className="loader">Loading...</div></div>;
  }

  // Render Auth Screen
  if (!user && !demoMode) {
    return <Auth onLoginSuccess={handleDemoLogin} />;
  }

  // Render Dashboard
  return (
    <div className="app-container">
      <header className="header" style={{ borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
        <div className="header-left">
          <CheckCircle className="text-primary" size={28} />
          <div>
            <h1 className="logo-text">FocusFlow</h1>
            <p className="tagline">Study smarter, focus longer.</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="flex-row gap-2" style={{ marginRight: 'var(--spacing-2)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }} className="desktop-only">{today}</span>
            <span style={{ 
              fontSize: '0.75rem', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary-color)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600
            }}>
              {focusTime} mins
            </span>
          </div>
          
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="icon-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
            <Settings size={20} />
          </button>
          <button className="icon-btn text-danger" onClick={handleLogout} title="Log Out">
            <LogOut size={20} />
          </button>
          <div className="avatar" title={demoMode ? "Demo User" : user?.email || "User"}>
            {user?.email ? user.email.charAt(0).toUpperCase() : 'JD'}
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar-column">
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
          <MotivationalStreak />
          <ProgressTracker focusTime={focusTime} />
        </aside>

        <section className="main-column">
          <TaskList />
          <QuickNotes />
        </section>
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default App;

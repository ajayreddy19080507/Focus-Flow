import React, { useState, useEffect } from 'react';
import { X, Moon, Type, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './SettingsModal.css';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    // Esc to close
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (fontSize === 'large') {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }
  }, [fontSize]);

  const resetData = () => {
    if(window.confirm("Are you sure you want to clear all your local data?")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="settings-body">
          <section className="settings-group">
            <h3>Appearance</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label"><Moon size={16}/> Dark Mode</span>
                <span className="setting-desc">Toggle light and dark themes</span>
              </div>
              <button className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}>
                <div className="toggle-knob"></div>
              </button>
            </div>
          </section>

          <section className="settings-group">
            <h3>Accessibility</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label"><Eye size={16}/> High Contrast</span>
                <span className="setting-desc">Increase contrast for better visibility</span>
              </div>
              <button className={`toggle-btn ${highContrast ? 'active' : ''}`} onClick={() => setHighContrast(!highContrast)}>
                <div className="toggle-knob"></div>
              </button>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label"><Type size={16}/> Large Text</span>
                <span className="setting-desc">Increase overall font size</span>
              </div>
              <button className={`toggle-btn ${fontSize === 'large' ? 'active' : ''}`} onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}>
                <div className="toggle-knob"></div>
              </button>
            </div>
          </section>

          <section className="settings-group">
            <h3>Data</h3>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Local Storage</span>
                <span className="setting-desc">Clear all tasks, notes, and progress</span>
              </div>
              <button className="reset-data-btn" onClick={resetData}>Reset Data</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

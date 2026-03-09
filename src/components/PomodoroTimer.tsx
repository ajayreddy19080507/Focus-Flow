import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './PomodoroTimer.css';

interface PomodoroTimerProps {
  onSessionComplete: (minutes: number) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Settings
  const focusTime = 25 * 60;
  const breakTime = 5 * 60;
  const longBreakTime = 15 * 60;

  const totalTime = mode === 'focus' ? focusTime : (mode === 'break' ? breakTime : longBreakTime);
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (soundEnabled) {
      playChime();
    }
    if (mode === 'focus') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      onSessionComplete(25);
      setShowModal(true); // Modal: Session complete - take 5 min break?
    } else {
      // Break is over, back to focus
      setMode('focus');
      setTimeLeft(focusTime);
    }
  };

  const playChime = () => {
    // Simple beep sound using AudioContext
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch(e) {}
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  const setPreset = (preset: 'focus' | 'break' | 'longBreak') => {
    if (isActive) {
      const confirm = window.confirm("Timer is running. Switch mode anyway?");
      if (!confirm) return;
    }
    setIsActive(false);
    setMode(preset);
    setTimeLeft(preset === 'focus' ? focusTime : (preset === 'break' ? breakTime : longBreakTime));
  };

  const handleModalAction = (action: 'break' | 'skip') => {
    setShowModal(false);
    if (action === 'break') {
      const nextBreak = sessionsCompleted % 4 === 0 ? 'longBreak' : 'break';
      setPreset(nextBreak);
      setIsActive(true); // Auto-start break
    } else {
      setPreset('focus');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVGs for circle
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="card pomodoro-card">
      <div className="timer-header">
        <h2 className="card-title">Pomodoro</h2>
        <button className="icon-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      <div className="preset-toggles">
        <button 
          className={`preset-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => setPreset('focus')}
        >Focus</button>
        <button 
          className={`preset-btn ${mode === 'break' ? 'active' : ''}`}
          onClick={() => setPreset('break')}
        >Short Break</button>
        <button 
          className={`preset-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => setPreset('longBreak')}
        >Long Break</button>
      </div>

      <div className="timer-display">
        <svg className="progress-ring" width="280" height="280">
          <circle 
            className="ring-bg" 
            strokeWidth="8" 
            fill="transparent" 
            r={radius} 
            cx="140" cy="140" 
          />
          <circle 
            className="ring-progress" 
            strokeWidth="8" 
            fill="transparent" 
            r={radius} 
            cx="140" cy="140" 
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: isActive ? 'stroke-dashoffset 1s linear' : 'none'
            }}
          />
        </svg>
        <div className="time-text">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="timer-controls">
        <button className="control-btn play-btn" onClick={toggleTimer}>
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button className="control-btn reset-btn" onClick={resetTimer}>
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="session-tracker">
        <div className="session-dots">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className={`dot ${sessionsCompleted % 4 >= num || (sessionsCompleted > 0 && sessionsCompleted % 4 === 0) ? 'filled' : ''}`}></div>
          ))}
        </div>
        <span className="session-text">Session {sessionsCompleted}/4</span>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Session complete — +25 focus minutes</h3>
            <p>Session complete — take a {sessionsCompleted % 4 === 0 ? '15' : '5'} min break?</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={() => handleModalAction('break')}>Start Break</button>
              <button className="btn-secondary" onClick={() => handleModalAction('skip')}>Skip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;

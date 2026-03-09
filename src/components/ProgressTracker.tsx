import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  focusTime: number; // in minutes
}

const dailyGoal = 180; // 3 hours

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ focusTime }) => {
  const goalPercent = Math.min(100, Math.round((focusTime / dailyGoal) * 100));
  
  // Animation states
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Small delay to ensure CSS transition triggers after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card progress-tracker-card">
      <div className="card-header-flex">
        <h2 className="card-title">Study Progress</h2>
        <TrendingUp size={18} className="text-primary" />
      </div>

      <div className="daily-goal-section">
        <div className="goal-header">
          <span className="goal-label">Daily Goal ({dailyGoal}m)</span>
          <span className="goal-value">{focusTime} / {dailyGoal} min</span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill goal-fill" 
            style={{ width: isLoaded ? `${goalPercent}%` : '0%' }}
          ></div>
        </div>
        {goalPercent >= 100 && (
          <p className="goal-reached">
            <Award size={14} /> Goal Reached!
          </p>
        )}
      </div>

      <div className="subjects-section">
        <h3 className="section-subtitle">By Subject</h3>
        <div className="subject-item">
          <div className="subject-header">
            <span>Operating Systems</span>
            <span>60%</span>
          </div>
          <div className="progress-bar-bg subject-bg">
            <div className="progress-bar-fill os-fill" style={{ width: isLoaded ? '60%' : '0%' }}></div>
          </div>
        </div>
        <div className="subject-item">
          <div className="subject-header">
            <span>DBMS</span>
            <span>25%</span>
          </div>
          <div className="progress-bar-bg subject-bg">
            <div className="progress-bar-fill dbms-fill" style={{ width: isLoaded ? '25%' : '0%' }}></div>
          </div>
        </div>
        <div className="subject-item">
          <div className="subject-header">
            <span>DSA</span>
            <span>15%</span>
          </div>
          <div className="progress-bar-bg subject-bg">
            <div className="progress-bar-fill dsa-fill" style={{ width: isLoaded ? '15%' : '0%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

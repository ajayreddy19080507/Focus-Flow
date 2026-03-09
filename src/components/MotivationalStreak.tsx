import React, { useState } from 'react';
import { Flame, Quote } from 'lucide-react';
import './MotivationalStreak.css';

const quotes = [
  "Focus is the new IQ.",
  "Small steps every day compound into big wins.",
  "Don't stop when you're tired. Stop when you're done.",
  "Success is the sum of small efforts repeated daily.",
  "Your future is created by what you do today."
];

const MotivationalStreak: React.FC = () => {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const streak = 5; // Hardcoded requirement

  return (
    <div className="card streak-card">
      <div className="streak-header">
        <div className="streak-info">
          <Flame size={24} className="streak-icon" fill="currentColor" />
          <div className="streak-text">
            <span className="streak-count">{streak} Day Streak!</span>
            <span className="streak-sub">Keep it up! 25 min/day</span>
          </div>
        </div>
        <div className="mini-calendar">
          {/* Mock mini calendar for last 7 days */}
          {[1, 2, 3, 4, 5].map(d => (
            <div key={d} className="cal-day active"></div>
          ))}
          <div className="cal-day inactive"></div>
          <div className="cal-day inactive"></div>
        </div>
      </div>

      <div className="quote-container">
        <Quote size={16} className="quote-mark" />
        <p className="quote-text">{quote}</p>
      </div>
    </div>
  );
};

export default MotivationalStreak;

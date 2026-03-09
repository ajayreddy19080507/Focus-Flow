import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { CheckCircle, Mail, Lock, User, ArrowRight } from 'lucide-react';
import './Auth.css';

interface AuthProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo bypass 
    if (email === 'demo@focusflow.com' && password === 'demo123') {
      onLoginSuccess();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key') {
        setError('Firebase not configured. Use demo@focusflow.com / demo123 to test.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-api-key') {
         setError('Firebase not configured. Use demo@focusflow.com / demo123 to test.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <button className="back-home-btn" onClick={onBackToHome}>
        <ArrowRight size={16} style={{transform: 'rotate(180deg)'}} /> 
        Back to Home
      </button>

      <div className="auth-brand">
        <CheckCircle className="brand-icon" size={48} />
        <h1>FocusFlow</h1>
        <p>Study smarter, focus longer.</p>
      </div>

      <div className="auth-scene">
        <div className={`auth-card ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* Sign In Face */}
          <div className="auth-face auth-front">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Log in to continue your streak.</p>
            
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSignIn} className="auth-form">
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-switch">
              <p>Don't have an account?</p>
              <button className="text-btn" onClick={toggleFlip}>Sign Up</button>
            </div>
          </div>

          {/* Sign Up Face */}
          <div className="auth-face auth-back">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join us and start focusing.</p>
            
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSignUp} className="auth-form">
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Full Name (Optional)" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="auth-switch">
              <p>Already have an account?</p>
              <button className="text-btn" onClick={toggleFlip}>Sign In</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;

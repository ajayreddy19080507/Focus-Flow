import React, { useState, useEffect } from 'react';
import { Save, Maximize2, Minimize2, Copy, Pin, PinOff } from 'lucide-react';
import './QuickNotes.css';

const QuickNotes: React.FC = () => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle'|'saving'|'saved'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('focusflow_quicknote');
    if (saved) setContent(saved);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== localStorage.getItem('focusflow_quicknote')) {
        setSaveStatus('saving');
        localStorage.setItem('focusflow_quicknote', content);
        setTimeout(() => setSaveStatus('saved'), 500);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard');
  };

  return (
    <div className={`card quick-notes-card ${isExpanded ? 'expanded' : ''} ${isPinned ? 'pinned' : ''}`}>
      <div className="notes-header">
        <h2 className="card-title">Quick Notes</h2>
        <div className="notes-actions">
          {saveStatus === 'saving' && <span className="save-status">Saving...</span>}
          {saveStatus === 'saved' && <span className="save-status success">Saved <Save size={12} /></span>}
          
          <button className="icon-btn" onClick={() => setIsPinned(!isPinned)} title={isPinned ? "Unpin" : "Pin"}>
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button className="icon-btn" onClick={handleCopy} title="Copy">
            <Copy size={16} />
          </button>
          <button className="icon-btn" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Collapse" : "Expand"}>
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      <textarea
        className="notes-textarea"
        placeholder="Jot something quick... (Supports markdown-lite *bold* - list)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck="false"
      />
      
      {/* Markdown hint */}
      <div className="notes-footer">
        <span className="markdown-hint">Supports basic markdown</span>
      </div>
    </div>
  );
};

export default QuickNotes;

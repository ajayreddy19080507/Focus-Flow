import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';
import './AICompanion.css';

const GROQ_API_KEY = "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";
const MODEL = "openai/gpt-oss-120b"; // Specific model requested by user

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const AICompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi! I'm your FocusFlow Study Buddy. Need help with OS, DBMS, or DSA? Or just want a motivation boost?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const tryFetch = async (modelName: string): Promise<boolean> => {
      try {
        const response = await fetch('/api-groq/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: 'system',
                content: "You are 'FocusFlow Study Buddy', a friendly and encouraging productivity coach. Specializing in OS, DBMS, and DSA. Keep responses brief and motivational."
              },
              ...messages.filter(m => m.role !== 'system'),
              userMsg
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices?.[0]?.message) {
          setMessages(prev => [...prev, data.choices[0].message]);
          return true;
        }
        return false;
      } catch (err: any) {
        if (modelName === MODEL && !err.message.includes('404')) {
          // If the primary model fails but not with a 404, try the fallback
          console.warn('Primary model failed, trying fallback...');
          return tryFetch('llama3-8b-8192');
        }
        throw err;
      }
    };

    try {
      await tryFetch(MODEL);
    } catch (error: any) {
      console.error('Groq API Error:', error);
      let errorMsg = `Connection issue: ${error.message}.`;
      if (error.message.includes('404')) {
        errorMsg = "The AI model is currently unavailable or the endpoint is incorrect (404). Switching to a more stable model or checking connection...";
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-companion-container">
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <Sparkles size={20} className="text-primary" />
            <h3>Study Buddy AI</h3>
            <button className="icon-btn" onClick={() => setIsOpen(false)} style={{marginLeft: 'auto'}}>
              <X size={18} />
            </button>
          </div>
          
          <div className="ai-messages" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', opacity: 0.7, fontSize: '0.75rem'}}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{msg.role === 'user' ? 'You' : 'Buddy'}</span>
                </div>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="message ai">
                <div className="typing-indicator">Buddy is thinking...</div>
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <input 
              type="text" 
              className="ai-input"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        className={`ai-fab ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Study Buddy"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
};

export default AICompanion;

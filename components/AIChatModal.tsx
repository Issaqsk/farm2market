
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export const AIChatModal: React.FC<{ role: string }> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: `Hello! I'm your Farm2Market assistant. How can I help you as a ${role.toLowerCase()} today?`, isBot: true }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);

    try {
      // Corrected initialization to use direct process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: You are an agri-tech expert assistant for Farm2Market. The user is a ${role}. 
        Answer this query helpfully: ${userMsg}`,
      });
      // response.text is a property, correct usage
      setMessages(prev => [...prev, { text: response.text || "I'm not sure how to answer that.", isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error connecting to AI.", isBot: true }]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-50 flex items-center gap-2"
      >
        <Bot size={24} />
        <span className="hidden md:inline font-semibold">AI Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
            <div className="p-4 border-b bg-emerald-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <h3 className="font-bold">Farm2Market Smart Advisor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-500 rounded-full p-1 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.isBot ? 'bg-white text-slate-700 border shadow-sm' : 'bg-emerald-600 text-white shadow-md'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about crops, prices, or trends..."
                className="flex-1 px-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={handleSend} className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

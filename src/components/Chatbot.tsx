import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, X, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm Ammie's AI assistant. I can help you get started with your repair estimate. Could you tell me a bit about your vehicle and the damage?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playAudio = async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.audio) return;

      const audioData = atob(data.audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Speech error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim().slice(0, 500);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });
      const data = await res.json();
      const botResponse = data.text || data.error || "I'm having trouble connecting. Please call us at (720) 676-5646.";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      playAudio(botResponse);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, something went wrong. Please call us at (720) 676-5646." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-50 flex items-center justify-center"
        id="chat-toggle"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200"
            id="chat-window"
          >
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold leading-none">Ammie's Assistant</h3>
                  <span className="text-xs text-emerald-100">Online | AI Receptionist</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="hover:bg-white/10 p-1.5 rounded transition-colors"
                  aria-label={isVoiceEnabled ? 'Mute voice' : 'Unmute voice'}
                >
                  {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded transition-colors" aria-label="Close chat">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] p-3 rounded-2xl text-sm',
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                    )}
                  >
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <Loader2 size={18} className="animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  maxLength={500}
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Powered by Ammie's AI • 9am-5pm Mon-Sat
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

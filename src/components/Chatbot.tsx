import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Send, Bot, Loader2, X, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

let messageCounter = 0;

export default function Chatbot({ isOpen, setIsOpen }: Props) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: ++messageCounter, role: 'bot', content: "Hi! I'm Sammie's AI assistant. I can help you get started with your repair estimate. Could you tell me a bit about your vehicle and the damage?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, [setIsOpen]);

  // Close AudioContext on unmount
  useEffect(() => {
    return () => { audioContextRef.current?.close(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus trap + Escape key when chat opens
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => inputRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); return; }
      if (e.key !== 'Tab' || !chatRef.current) return;
      const focusable = Array.from(
        chatRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const playAudio = useCallback(async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) view[i] = audioData.charCodeAt(i);

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        await audioContextRef.current.resume();
        const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      }
    } catch (error) {
      console.error("Speech Generation Error:", error);
    }
  }, [isVoiceEnabled]);

  useEffect(() => {
    if (isOpen && messages.length === 1 && messages[0].role === 'bot') {
      playAudio(messages[0].content);
    }
  }, [isOpen, messages, playAudio]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: ++messageCounter, role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Cap history at 10 messages to control token usage
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `You are an AI receptionist for Sammie's Autobody Shop.
          Your goal is to collect the following information from the user:
          1. Wrecked car information (Make, Model, Year, and description of damage).
          2. Whether they have insurance.
          3. When they would like to come in for an estimate.

          Contact Information:
          - Phone: 720-676-5646

          Business Hours:
          - Monday - Saturday: 9:00 AM to 5:00 PM
          - Sunday: Closed

          Be professional, empathetic, and helpful.
          Always provide the correct business hours and phone number if asked.
          If the user provides all info, thank them and let them know someone will reach out to confirm.
          Keep responses concise and friendly.`
        }
      });

      const botResponse = response.text || "I'm sorry, I'm having trouble connecting right now. Please try again or call us directly.";
      setMessages(prev => [...prev, { id: ++messageCounter, role: 'bot', content: botResponse }]);
      playAudio(botResponse);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { id: ++messageCounter, role: 'bot', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat with AI assistant"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Sammie's AI Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200"
          >
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold leading-none">Sammie's Assistant</h3>
                  <span className="text-xs text-emerald-100">Online | AI Receptionist</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  aria-label={isVoiceEnabled ? "Mute voice responses" : "Enable voice responses"}
                  className="hover:bg-white/10 p-1.5 rounded transition-colors"
                >
                  {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="hover:bg-white/10 p-1.5 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.role === 'user'
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none"
                  )}>
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <Loader2 size={18} className="animate-spin text-emerald-600" aria-label="Loading response" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">Type a message</label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Powered by Sammie's AI • 9am-5pm Mon-Sat
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

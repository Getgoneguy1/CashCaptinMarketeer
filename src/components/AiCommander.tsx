import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  Flame,
  ArrowRight,
  Zap,
  RefreshCw,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Offer, TrackingMetrics, MasterAuthSession } from '../types';
import { NavTab } from './Header';
import { AppUserProfile } from '../services/userAuthService';
import { executeAiCommand, AiCommandResult } from '../services/aiCommanderService';
import { getAddonAppState } from '../services/userLicenseService';

interface AiCommanderProps {
  offers: Offer[];
  tracking: TrackingMetrics;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onSaveNewOffer: (offer: Offer) => void;
  onOpenSocialBlast: () => void;
  onOpenLicenseModal: () => void;
  onOpenAuthModal: () => void;
  masterSession?: MasterAuthSession;
  currentUser?: AppUserProfile | null;
}

interface MessageHistoryItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sourceAgent?: 'CashCaptain_AI' | 'AI_Hub_Agent' | 'Viral_AI_Assistant' | 'Ecosystem_Triad';
  actionTaken?: any;
  crossAppDialogue?: {
    agentName: string;
    message: string;
    status: 'connected' | 'not_linked' | 'synced';
  }[];
  suggestedPrompts?: string[];
  timestamp: string;
}

export const AiCommander: React.FC<AiCommanderProps> = ({
  offers,
  tracking,
  activeTab,
  setActiveTab,
  onSaveNewOffer,
  onOpenSocialBlast,
  onOpenLicenseModal,
  onOpenAuthModal,
  masterSession,
  currentUser
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const isMasterUser = !!masterSession?.isMasterLoggedIn;
  const hubState = getAddonAppState('hub', isMasterUser);
  const viralState = getAddonAppState('viral', isMasterUser);

  // Message History
  const [messages, setMessages] = useState<MessageHistoryItem[]>([
    {
      id: 'welcome',
      sender: 'ai',
      sourceAgent: 'Ecosystem_Triad',
      text: `Hello! I am your **Cash Captain AI Commander**. I have full control over all functions of this app and communicate directly with the **AI Hub** and **Viral AI Assistant**.\n\nYou can talk or type to me anytime to place ads, write viral hooks, check stats, or control any screen.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Place ads for my product',
        'Ask Viral AI Assistant for hooks',
        'How many clicks do I have?',
        'Go to My Offers'
      ]
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleExecute(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission blocked. Please enable mic access or type your command.');
          } else {
            setSpeechError('Voice not recognized. Please try again or type your command.');
          }
          setTimeout(() => setSpeechError(null), 4000);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text to Speech
  const speakAloud = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '').slice(0, 240);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error', e);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Voice input is not supported in this browser. Please type your message.');
      setTimeout(() => setSpeechError(null), 3500);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Failed to start speech recognition', e);
      }
    }
  };

  const handleExecute = async (commandToRun?: string) => {
    const query = (commandToRun || inputText).trim();
    if (!query || isProcessing) return;

    setIsProcessing(true);
    setIsExpanded(true);
    setInputText('');

    // Add user message
    const userMsg: MessageHistoryItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res: AiCommandResult = await executeAiCommand(query, {
        offers,
        tracking,
        activeTab,
        setActiveTab,
        onSaveNewOffer,
        onOpenSocialBlast,
        onOpenLicenseModal,
        onOpenAuthModal,
        isMasterUser
      });

      const aiMsg: MessageHistoryItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        sourceAgent: res.sourceAgent,
        text: res.reply,
        actionTaken: res.actionTaken,
        crossAppDialogue: res.crossAppDialogue,
        suggestedPrompts: res.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakAloud(res.reply);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          sourceAgent: 'CashCaptain_AI',
          text: `I encountered an issue processing that command: ${err.message || 'Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Scroll to bottom of message list
  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  return (
    <div className="bg-[#0b1020] border-y sm:border sm:rounded-2xl border-slate-800 shadow-2xl overflow-hidden transition-all duration-300 mb-6">
      {/* Top Bar: Cross-App AI Neural Sync Indicators */}
      <div className="bg-[#070b16] px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Command Center</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Direct Voice &amp; Text Control Over All App Functions
          </span>
        </div>

        {/* 3-in-1 AI Bridge Status */}
        <div className="flex items-center gap-2">
          {/* Cash Captain AI Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Captain AI (Host)</span>
          </div>

          {/* AI Hub Agent Badge */}
          <div
            onClick={() => setActiveTab('affiliate_pro')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono cursor-pointer transition ${
              hubState.isLinked
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={hubState.isLinked ? 'AI Hub Agent Linked' : 'Click to Link AI Hub'}
          >
            <Globe className="w-2.5 h-2.5" />
            <span>AI Hub {hubState.isLinked ? '●' : '○'}</span>
          </div>

          {/* Viral AI Assistant Badge */}
          <div
            onClick={() => setActiveTab('affiliate_pro')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono cursor-pointer transition ${
              viralState.isLinked
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={viralState.isLinked ? 'Viral AI Assistant Linked' : 'Click to Link Viral AI Assistant'}
          >
            <Flame className="w-2.5 h-2.5" />
            <span>Viral AI {viralState.isLinked ? '●' : '○'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSpeechEnabled((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              speechEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={speechEnabled ? 'Mute AI Voice Responses' : 'Enable AI Audio Speech'}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title={isExpanded ? 'Collapse Conversation' : 'Expand Conversation'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Command Input Box & Microphone */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-b from-[#0c1222] to-[#080d1a]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl border transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-lg ${
              isListening
                ? 'bg-red-500 text-white border-red-400 animate-pulse ring-4 ring-red-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700 hover:border-emerald-500/50'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak to the AI'}
          >
            {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Natural Language Command Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to you speak now... Say your command!'
                  : "Tell the AI what to do... (e.g. 'Place ads for...', 'Ask Viral AI for hooks', 'Check my stats')"
              }
              className={`w-full px-4 py-3 bg-[#060913] border rounded-xl text-white text-xs sm:text-sm focus:outline-none transition-all ${
                isListening
                  ? 'border-red-500 ring-2 ring-red-500/20 placeholder:text-red-300 font-semibold'
                  : 'border-slate-800 focus:border-emerald-500 placeholder:text-slate-500'
              }`}
            />
            {isProcessing && (
              <div className="absolute right-3 top-3.5">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shrink-0 shadow-md ${
              inputText.trim() && !isProcessing
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Run</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="mt-2 text-xs text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/40">
            {speechError}
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 scrollbar-none text-[11px]">
          <span className="text-slate-500 shrink-0 font-medium">Try:</span>
          <button
            type="button"
            onClick={() => handleExecute('Place ads for my product')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 shrink-0 cursor-pointer transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Place New Ad</span>
          </button>
          <button
            type="button"
            onClick={() => handleExecute('Ask Viral AI Assistant for hooks')}
            className="px-2.5 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-800/50 shrink-0 cursor-pointer transition flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-purple-400" />
            <span>Ask Viral AI for Hooks</span>
          </button>
          <button
            type="button"
            onClick={() => handleExecute('Talk to AI Hub')}
            className="px-2.5 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-900/40 text-blue-200 border border-blue-800/50 shrink-0 cursor-pointer transition flex items-center gap-1"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span>Talk to AI Hub</span>
          </button>
          <button
            type="button"
            onClick={() => handleExecute('How many clicks and revenue do I have?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 shrink-0 cursor-pointer transition"
          >
            📊 Check My Stats
          </button>
          <button
            type="button"
            onClick={() => handleExecute('Show my offers')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 shrink-0 cursor-pointer transition"
          >
            📂 Go to My Offers
          </button>
        </div>
      </div>

      {/* Expandable Conversation & Action Log Area */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-[#060913] max-h-96 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-3.5 text-xs sm:text-sm space-y-2 leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-[#0f172a] text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {/* Agent Attribution */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800/80 text-[11px] font-mono">
                    {msg.sourceAgent === 'Viral_AI_Assistant' ? (
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Affiliate Viral AI Assistant
                      </span>
                    ) : msg.sourceAgent === 'AI_Hub_Agent' ? (
                      <span className="text-blue-400 font-bold flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Affiliate Pro AI Hub Agent
                      </span>
                    ) : msg.sourceAgent === 'Ecosystem_Triad' ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        3-in-1 Ecosystem AI Network
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        Cash Captain AI Commander
                      </span>
                    )}
                    <span className="text-slate-500">• {msg.timestamp}</span>
                  </div>
                )}

                {/* Message text with basic markdown formatting */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <span key={lIdx} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>

                {/* Cross-App AI Communication Dialogue Breadcrumb */}
                {msg.crossAppDialogue && msg.crossAppDialogue.length > 0 && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>Cross-App AI Communication Log</span>
                    </div>
                    {msg.crossAppDialogue.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                            item.status === 'synced'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : item.status === 'not_linked'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {item.agentName}
                        </span>
                        <span className="text-slate-300">{item.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested follow-up prompt chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, prIdx) => (
                      <button
                        key={prIdx}
                        type="button"
                        onClick={() => handleExecute(prompt)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700 transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{prompt}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

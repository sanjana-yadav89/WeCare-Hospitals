import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  PhoneCall,
  Activity,
  Calendar,
  AlertCircle,
  RefreshCw,
  Send,
  MessageSquareText,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { pcmFloat32ToBase64, AudioPlaybackQueue } from '../utils/audioStreamer';
import { DOCTORS_DATABASE, HOSPITAL_DEPARTMENTS } from '../data/hospitalData';

interface VoiceConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (departmentId?: string, doctorId?: string) => void;
}

interface TranscriptMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const VoiceConsultationModal: React.FC<VoiceConsultationModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [detectedDepartment, setDetectedDepartment] = useState<string | null>(null);
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    {
      id: 'welcome-1',
      sender: 'model',
      text: 'Hello, I am Dr. WeCare Voice, your AI Clinical Voice Specialist. Please describe your symptoms or health concerns, and I will guide you to the right department.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<AudioPlaybackQueue>(new AudioPlaybackQueue());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Auto scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isModelSpeaking]);

  // Connect WebSocket and initialize audio when opened
  useEffect(() => {
    if (isOpen) {
      initWebSocketConnection();
    } else {
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    stopMicrophone();
    playbackQueueRef.current.stopAll();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsMicActive(false);
    setIsModelSpeaking(false);
  };

  const initWebSocketConnection = () => {
    setIsConnecting(true);
    setErrorMessage(null);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/live`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      startMicrophone();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'audio' && data.audio) {
          if (!isMuted) {
            playbackQueueRef.current.enqueueChunk(data.audio);
            setIsModelSpeaking(true);
          }
        } else if (data.type === 'interrupted') {
          playbackQueueRef.current.stopAll();
          setIsModelSpeaking(false);
        } else if (data.type === 'model_transcript' && data.text) {
          handleModelTranscript(data.text);
        } else if (data.type === 'error') {
          setErrorMessage(data.message || 'Live connection encountered an issue.');
        } else if (data.type === 'session_closed') {
          setIsConnected(false);
        }
      } catch (err) {
        console.error('Error handling ws message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setErrorMessage('Could not connect to live voice server. Please check your network.');
      setIsConnecting(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };
  };

  const handleModelTranscript = (text: string) => {
    // Detect recommended department from text
    const lower = text.toLowerCase();
    if (lower.includes('cardio') || lower.includes('heart') || lower.includes('chest pain')) {
      setDetectedDepartment('cardiology');
    } else if (lower.includes('neuro') || lower.includes('brain') || lower.includes('migraine') || lower.includes('dizziness')) {
      setDetectedDepartment('neurology');
    } else if (lower.includes('ortho') || lower.includes('bone') || lower.includes('joint') || lower.includes('back pain')) {
      setDetectedDepartment('orthopedics');
    } else if (lower.includes('pediatric') || lower.includes('child') || lower.includes('infant')) {
      setDetectedDepartment('pediatrics');
    } else if (lower.includes('gastro') || lower.includes('stomach') || lower.includes('acid') || lower.includes('digest')) {
      setDetectedDepartment('gastroenterology');
    } else if (lower.includes('derma') || lower.includes('skin') || lower.includes('rash')) {
      setDetectedDepartment('dermatology');
    }

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.sender === 'model' && lastMsg.id.startsWith('live-model-')) {
        return [
          ...prev.slice(0, -1),
          { ...lastMsg, text: lastMsg.text + ' ' + text },
        ];
      } else {
        return [
          ...prev,
          {
            id: `live-model-${Date.now()}`,
            sender: 'model',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
    });
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      // Realtime Audio Volume Meter
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(avg / 128); // 0 to 2
        }
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      processor.onaudioprocess = (e) => {
        if (!isMicActive && !wsRef.current) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Audio = pcmFloat32ToBase64(inputData);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'audio',
              audio: base64Audio,
            })
          );
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setIsMicActive(true);
    } catch (err: any) {
      console.warn('Microphone access denied or error:', err);
      setIsMicActive(false);
      setErrorMessage('Microphone access was denied. You can still type below to chat in real-time.');
    }
  };

  const stopMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsMicActive(false);
  };

  const toggleMic = () => {
    if (isMicActive) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  const handleSendText = (customText?: string) => {
    const textToSend = customText || textInput.trim();
    if (!textToSend) return;

    // Add to user messages
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'text',
          text: textToSend,
        })
      );
    }

    setTextInput('');
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'I have sudden sharp chest pain radiating to left shoulder',
    'Severe throbbing migraine with light sensitivity for 2 days',
    'My toddler has a 102°F fever with cough and runny nose',
    'Chronic knee pain when climbing stairs after sports injury',
  ];

  const matchedDept = HOSPITAL_DEPARTMENTS.find((d) => d.id === detectedDepartment);
  const matchedDoctor = DOCTORS_DATABASE.find((doc) => doc.departmentId === detectedDepartment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div
        id="voice-consult-modal-container"
        className="relative w-full max-w-3xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                  isConnected ? 'bg-emerald-500' : isConnecting ? 'bg-amber-500 animate-ping' : 'bg-red-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Dr. WeCare Voice Assistant</h3>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Gemini Live 3.1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isConnecting
                  ? 'Connecting to real-time voice stream...'
                  : isConnected
                  ? 'Live 2-Way Audio Connected • Speak Naturally'
                  : 'Disconnected'}
              </p>
            </div>
          </div>

          <button
            id="close-voice-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Interactive Stage */}
        <div className="p-6 bg-radial from-teal-900/20 via-slate-900/60 to-slate-950 flex flex-col items-center justify-center border-b border-slate-800">
          {/* Animated Waveform Orb */}
          <div className="relative flex items-center justify-center my-3">
            {/* Pulsing Aura */}
            <div
              className={`absolute w-36 h-36 rounded-full blur-xl transition-all duration-300 ${
                isModelSpeaking
                  ? 'bg-emerald-500/40 scale-125 animate-pulse'
                  : isMicActive
                  ? 'bg-teal-500/30 scale-110'
                  : 'bg-slate-700/20'
              }`}
            />

            {/* Visualizer Circle */}
            <div
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-200 shadow-xl ${
                isModelSpeaking
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                  : isMicActive
                  ? 'bg-teal-950/90 border-teal-400 text-teal-300 shadow-teal-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
              style={{
                transform: `scale(${1 + Math.min(audioLevel * 0.25, 0.35)})`,
              }}
            >
              {isModelSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce text-emerald-300" />
              ) : isMicActive ? (
                <Mic className="w-10 h-10 text-teal-300" />
              ) : (
                <MicOff className="w-10 h-10 text-slate-500" />
              )}

              <span className="text-[10px] font-semibold mt-1 tracking-wide uppercase">
                {isModelSpeaking ? 'Speaking' : isMicActive ? 'Listening' : 'Muted'}
              </span>
            </div>
          </div>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-center gap-1.5 h-8 my-2">
            {[...Array(12)].map((_, i) => {
              const height = isMicActive || isModelSpeaking
                ? Math.max(6, Math.sin(i + Date.now() * 0.01) * 20 * (audioLevel + 0.3))
                : 4;
              return (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isModelSpeaking
                      ? 'bg-emerald-400'
                      : isMicActive
                      ? 'bg-teal-400'
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3 mt-2">
            <button
              id="voice-toggle-mic-btn"
              onClick={toggleMic}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                isMicActive
                  ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isMicActive ? 'Microphone Active' : 'Unmute Mic'}</span>
            </button>

            <button
              id="voice-toggle-speaker-btn"
              onClick={() => {
                if (!isMuted) playbackQueueRef.current.stopAll();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                isMuted
                  ? 'bg-red-950/40 border-red-500/50 text-red-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={isMuted ? 'Unmute Speaker Output' : 'Mute Speaker Output'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              id="voice-reconnect-btn"
              onClick={initWebSocketConnection}
              className="p-2 rounded-xl text-xs cursor-pointer border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              title="Reconnect Voice Session"
            >
              <RefreshCw className={`w-4 h-4 ${isConnecting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Triage Recommendation Banner */}
        {detectedDepartment && (
          <div className="px-6 py-3 bg-emerald-950/60 border-y border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-200">
                  Specialist Recommendation: {matchedDept?.name || 'Specialist Consultation'}
                </p>
                <p className="text-[11px] text-emerald-400/80">
                  {matchedDoctor
                    ? `${matchedDoctor.name} • ${matchedDoctor.title || matchedDoctor.specialty}`
                    : 'Expert outpatient physicians ready for priority appointment.'}
                </p>
              </div>
            </div>
            <button
              id="voice-book-doctor-action-btn"
              onClick={() => {
                onClose();
                onBookAppointment(detectedDepartment, matchedDoctor?.id);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Priority OPD</span>
            </button>
          </div>
        )}

        {/* Live Conversation Transcript Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[300px] bg-slate-950/40">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="block text-[10px] text-slate-400 mt-1 text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-900/90 border-t border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <MessageSquareText className="w-3 h-3 text-teal-400" />
            Try saying:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handleSendText(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Text Fallback Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            id="voice-modal-text-input"
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Type symptoms or speak aloud into microphone..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            id="voice-modal-send-btn"
            onClick={() => handleSendText()}
            disabled={!textInput.trim()}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

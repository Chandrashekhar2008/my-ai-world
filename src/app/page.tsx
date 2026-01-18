'use client';
import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [provider, setProvider] = useState('gemini');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { provider },
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ULTRA-AI REALTIME
          </h1>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setProvider('gemini')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${provider === 'gemini' ? 'bg-blue-600 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            > GEMINI 2.0 </button>
            <button 
              onClick={() => setProvider('openai')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${provider === 'openai' ? 'bg-purple-600 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            > CHATGPT 4O </button>
          </div>
        </div>

        {/* Chat Container */}
        <div ref={scrollRef} className="space-y-6 h-[70vh] overflow-y-auto pr-4 custom-scrollbar mb-20">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <div className="w-20 h-20 border-2 border-dashed border-white rounded-full animate-spin-slow mb-4" />
              <p className="text-xl">All systems operational. Awaiting query...</p>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`group relative max-w-[85%] p-5 rounded-3xl border ${
                m.role === 'user' 
                ? 'bg-blue-600/10 border-blue-500/40 rounded-br-none' 
                : 'bg-white/5 border-white/10 rounded-bl-none backdrop-blur-2xl'
              }`}>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">{m.role}</p>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </div>

                {/* Real-time Tool Status */}
                {m.toolInvocations?.map((tool) => (
                  <div key={tool.toolCallId} className="mt-4 flex items-center gap-2 text-[11px] font-mono p-2 bg-white/5 rounded-lg border border-white/5">
                    <span className="animate-pulse">🌐</span>
                    <span className="text-blue-400 uppercase">{tool.state === 'call' ? 'Searching Internet...' : 'Knowledge Grounded'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-blue-400 text-xs animate-pulse font-mono tracking-widest">AI_THINKING_PROCESSSING...</div>}
        </div>

        {/* Input Dock */}
        <div className="fixed bottom-6 left-0 right-0 px-4">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
            <input 
              value={input} 
              onChange={handleInputChange}
              placeholder="Ask anything (e.g., 'What's the price of Gold in Raipur today?')"
              className="relative w-full bg-[#111] border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
            />
          </form>
        </div>
      </div>
    </main>
  );
}
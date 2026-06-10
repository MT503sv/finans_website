'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { marked } from 'marked'
import { SendHorizontal } from 'lucide-react'
import 'katex/dist/katex.min.css'
import renderMathInElement from 'katex/dist/contrib/auto-render'

const KUALI_API_URL =
  process.env.NEXT_PUBLIC_KUALI_API_URL ||
  "http://127.0.0.1:5000"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  updatedAt?: number
}

const formatMessageContent = (content: string) => {
  if (!content) return '';
  let text = content;
  const mathBlocks: string[] = [];
  const replacer = (match: string) => { mathBlocks.push(match); return `@@@MATH_BLOCK_${mathBlocks.length - 1}@@@`; };
  text = text.replace(/\\\[[\s\S]+?\\\]/g, replacer);
  text = text.replace(/\\\([\s\S]+?\\\)/g, replacer);
  text = text.replace(/\$\$[\s\S]+?\$\$/g, replacer);
  text = text.replace(/\[\s[\s\S]+?\s\]/g, replacer);
  text = text.replace(/\$[^$\n]+?\$/g, replacer);
  let parsedHtml = marked.parse(text) as string;
  mathBlocks.forEach((block, index) => { parsedHtml = parsedHtml.replace(`@@@MATH_BLOCK_${index}@@@`, block); });
  return parsedHtml;
};

function PageHeader({
  sidebarOpen,
  onToggleSidebar,
  showToggle,
}: {
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  showToggle?: boolean
}) {
  return (
    <header className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 border-b border-gray-100">
      {showToggle && !sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="p-1 cursor-pointer hover:bg-gray-100 transition-colors rounded"
          aria-label="Open sidebar"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hidebutton.png" alt="show" className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-[#010221]">Kuali</h1>
    </header>
  )
}

function SidebarContent({
  chatHistory,
  activeChatId,
  onNewChat,
  onLoadChat,
  onClose,
  onContextMenu,
  getRelativeTime,
}: {
  chatHistory: Chat[]
  activeChatId: string | null
  onNewChat: () => void
  onLoadChat: (id: string) => void
  onClose: () => void
  onContextMenu: (x: number, y: number, chatId: string) => void
  getRelativeTime: (updatedAt?: number, fallbackId?: string) => string
}) {
  return (
    <div className="w-[280px] flex flex-col h-full">
      <div className="flex justify-between items-center p-4 sm:p-6">

        {/* Fixed: Restored the missing opening tag. Change to <Link> if using Next.js routing */}
        <a
          href="/dashboard"
          className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="text-sm font-semibold">Back</span>
        </a>

        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 cursor-pointer transition-colors rounded"
          aria-label="Close sidebar"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hidebutton.png" alt="hide" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="px-4 sm:px-6 mb-6 sm:mb-8">
        <button
          onClick={onNewChat}
          className="w-full bg-[#C2D4FF] hover:bg-[#b0c4f0] text-black font-bold py-2.5 sm:py-3 px-4 rounded-xl flex items-center justify-center gap-3 shadow-sm transition-colors cursor-pointer text-sm sm:text-base"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-black flex items-center justify-center text-xs font-black">+</div>
          New Chat
        </button>
      </div>

      <div className="px-4 sm:px-6 flex-grow overflow-y-auto pb-10">
        <h3 className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 sm:mb-4">Recents</h3>
        <div className="space-y-2 sm:space-y-3">
          {chatHistory.map(chat => (
            <div
              key={chat.id}
              onClick={() => onLoadChat(chat.id)}
              onContextMenu={(e) => { e.preventDefault(); onContextMenu(e.clientX, e.clientY, chat.id); }}
              className={`p-2.5 sm:p-3 rounded-xl cursor-pointer flex items-center gap-2 sm:gap-3 transition-all ${chat.id === activeChatId
                  ? 'bg-white/10 ring-1 ring-white/20'
                  : 'bg-white/5 hover:bg-white/10'
                }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/globo.png" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 shrink-0" alt="chat" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs sm:text-sm truncate font-medium">{chat.title}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 capitalize">
                  {getRelativeTime(chat.updatedAt, chat.id)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function KualiPage() {
  const { user, isLoaded } = useUser()

  const [mounted, setMounted] = useState(false)
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [showInitial, setShowInitial] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 768
  })
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chatId: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

/* eslint-disable react-hooks/set-state-in-effect */
useEffect(() => {
  try {
    const savedChats = localStorage.getItem('kuali_chatHistory')
    const savedActiveId = localStorage.getItem('kuali_activeChatId')
    if (savedChats) {
      const parsed: Chat[] = JSON.parse(savedChats)
      setChatHistory(parsed)
      if (savedActiveId) {
        setActiveChatId(savedActiveId)
        const chat = parsed.find(c => c.id === savedActiveId)
        if (chat) { setMessages(chat.messages); setShowInitial(false) }
      }
    }
  } catch {}
  setMounted(true)
}, [])
/* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => { if (!mounted) return; localStorage.setItem('kuali_chatHistory', JSON.stringify(chatHistory)) }, [chatHistory, mounted])
  useEffect(() => { if (!mounted) return; localStorage.setItem('kuali_activeChatId', activeChatId || '') }, [activeChatId, mounted])

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!chatContainerRef.current) return
    const el = chatContainerRef.current
    setTimeout(() => {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: '\\[', right: '\\]', display: true },
            { left: '[ ', right: ' ]', display: true },
            { left: '\\(', right: '\\)', display: false },
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        })
        el.scrollTop = el.scrollHeight
      } catch { }
    }, 300)
  }, [messages, showInitial, sidebarOpen, activeChatId, isLoading])

  function loadChat(chatId: string | null) {
    setActiveChatId(chatId)
    if (!chatId) { setMessages([]); setShowInitial(true) }
    else {
      const chat = chatHistory.find(c => c.id === chatId)
      if (chat) { setMessages(chat.messages); setShowInitial(false) }
    }
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  function getRelativeTime(updatedAt?: number, fallbackId?: string) {
    const timeToUse = updatedAt || (fallbackId ? parseInt(fallbackId) : Date.now());
    if (isNaN(timeToUse)) return 'Today';
    const date = new Date(timeToUse);
    const now = new Date();
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((startOfNow.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24));
    const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    if (diffDays === 0) return `Today, ${timeString}`;
    if (diffDays === 1) return `Yesterday, ${timeString}`;
    if (diffDays >= 2 && diffDays < 7) return `${diffDays} days ago`;
    if (diffDays >= 7 && diffDays < 14) return `1 week ago`;
    if (diffDays >= 14 && diffDays < 21) return `2 weeks ago`;
    if (diffDays >= 21 && diffDays < 28) return `3 weeks ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths >= 1 && diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  function handleDeleteChat(chatId: string) {
    const filtered = chatHistory.filter(c => c.id !== chatId)
    setChatHistory(filtered)
    setContextMenu(null)
    if (activeChatId === chatId) { setMessages([]); setActiveChatId(null); setShowInitial(true) }
  }

  const handleKeySubmit = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  async function sendMessage() {
    const userQuestion = userInput.trim()
    if (!userQuestion || isLoading || !isLoaded || !user) return

    setUserInput(''); setShowInitial(false); setIsLoading(true)

    let currentChatId = activeChatId
    let updatedHistory = [...chatHistory]

    if (!currentChatId) {
      const newId = Date.now().toString()
      const newChat: Chat = {
        id: newId,
        title: userQuestion.length > 30 ? userQuestion.substring(0, 30) + '...' : userQuestion,
        messages: [],
        updatedAt: Date.now()
      }
      updatedHistory = [newChat, ...updatedHistory]
      setChatHistory(updatedHistory); setActiveChatId(newId); currentChatId = newId
    }

    const userMsg: Message = { role: 'user', content: userQuestion }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setChatHistory(updatedHistory.map(c => c.id === currentChatId ? { ...c, messages: newMessages, updatedAt: Date.now() } : c))

    try {
      const response = await fetch(`${KUALI_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuestion,
          user_id: user.id,
        })
      })
      const data = await response.json()
      const assistantMsg: Message = { role: 'assistant', content: data.response || 'Sorry, an error occurred.' }
      const finalMessages = [...newMessages, assistantMsg]
      setMessages(finalMessages)
      setChatHistory(updatedHistory.map(c => c.id === currentChatId ? { ...c, messages: finalMessages, updatedAt: Date.now() } : c))
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Backend connection error. Please make sure app.py is running.' }])
    } finally {
      setIsLoading(false)
    }
  }

  // ─── Skeleton (SSR) ───────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="h-screen flex overflow-hidden bg-white">
        <aside style={{ width: '280px', minWidth: '280px' }} className="hidden md:flex bg-[#010221] text-white flex-col overflow-hidden shrink-0">
          <div className="w-[280px] flex flex-col h-full">
            <div className="flex justify-between items-center p-6">
              <span className="text-sm font-semibold text-white/70">Back</span>
            </div>
          </div>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#010221]">Kuali</h1>
          </header>
        </main>
      </div>
    )
  }

  // ─── Full render ──────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex overflow-hidden bg-white relative">

      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 bg-[#010221] border border-gray-600 shadow-xl rounded-lg py-1 min-w-[120px] overflow-hidden"
        >
          <button
            onClick={() => handleDeleteChat(contextMenu.chatId)}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 text-sm font-semibold transition-colors flex items-center gap-2"
          >
            Delete chat
          </button>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar DESKTOP ── */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '0px',
          minWidth: sidebarOpen ? '280px' : '0px',
          transition: 'width 0.3s ease, min-width 0.3s ease',
        }}
        className="hidden md:flex bg-[#010221] text-white flex-col overflow-hidden shrink-0"
      >
        <SidebarContent
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onNewChat={() => loadChat(null)}
          onLoadChat={loadChat}
          onClose={() => setSidebarOpen(false)}
          onContextMenu={(x, y, chatId) => setContextMenu({ x, y, chatId })}
          getRelativeTime={getRelativeTime}
        />
      </aside>

      {/* ── Sidebar MOBILE ── */}
      {sidebarOpen && (
        <aside className="flex md:hidden fixed inset-y-0 left-0 z-30 w-[280px] bg-[#010221] text-white flex-col overflow-hidden">
          <SidebarContent
            chatHistory={chatHistory}
            activeChatId={activeChatId}
            onNewChat={() => loadChat(null)}
            onLoadChat={loadChat}
            onClose={() => setSidebarOpen(false)}
            onContextMenu={(x, y, chatId) => setContextMenu({ x, y, chatId })}
            getRelativeTime={getRelativeTime}
          />
        </aside>
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PageHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(true)}
          showToggle={true}
        />

        <div ref={chatContainerRef} className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-8 md:px-12 lg:px-20 pb-6 sm:pb-10">
          {showInitial ? (
            <div className="flex-1 flex flex-col items-center justify-center mb-16 sm:mb-20 px-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-black mb-6 sm:mb-10 tracking-tight leading-tight">
                Optimize your financial decisions
              </h2>

              <div className="flex bg-gray-100 p-1 sm:p-1.5 rounded-full mb-8 sm:mb-12 shadow-inner border border-gray-200">
                <button className="bg-[#010221] text-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg">?</span> Questions
                </button>
              </div>

              <div className="w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <div className="bg-white border-2 border-gray-100 shadow-2xl shadow-blue-100/50 rounded-2xl p-4 sm:p-6 flex items-end gap-3">
                  <textarea
                    rows={3}
                    value={userInput}
                    disabled={isLoading || !isLoaded}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={!isLoaded ? 'Loading...' : isLoading ? 'Kuali is thinking...' : 'Message Kuali'}
                    className="w-full bg-transparent resize-none focus:outline-none text-gray-700 font-medium disabled:opacity-50 text-sm sm:text-base"
                    onKeyDown={handleKeySubmit}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !isLoaded}
                    className="bg-[#C2D4FF] p-2.5 sm:p-3 rounded-full hover:bg-[#b0c4f0] shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-[#010221]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-6 sm:pt-10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-4 sm:p-6 rounded-2xl shadow-sm text-sm sm:text-base ${msg.role === 'user'
                        ? 'bg-[#C2D4FF] text-black font-medium'
                        : 'bg-gray-50 text-gray-800 border border-gray-100'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatMessageContent(msg.content) }} />
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 sm:p-5 rounded-2xl shadow-sm bg-gray-50 text-gray-500 border border-gray-100 flex items-center gap-2 sm:gap-3">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-[#010221]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium italic text-gray-400">Kuali is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!showInitial && (
          <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 bg-white border-t border-gray-100">
            <div className="max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-lg">
              <input
                type="text"
                disabled={isLoading || !isLoaded}
                className="flex-1 focus:outline-none text-black font-medium text-sm sm:text-base ml-1 sm:ml-2 disabled:opacity-50 min-w-0"
                placeholder={!isLoaded ? 'Loading...' : isLoading ? 'Kuali is thinking...' : 'Message Kuali'}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeySubmit}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !isLoaded}
                className="bg-[#C2D4FF] p-1.5 sm:p-2 rounded-full hover:bg-[#b0c4f0] shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-[#010221]" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
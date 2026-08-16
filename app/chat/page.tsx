'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { ArrowRight, Send } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function ChatPage() {
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setCurrentUser(d.user))
      .catch(() => {})

    fetch('/api/chat')
      .then((res) => res.json())
      .then((d) => {
        setContacts(d.contacts || [])
        if (d.contacts && d.contacts.length > 0) {
          setSelectedContact(d.contacts[0])
          setShowMobileChat(true)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedContact) fetchMessages(selectedContact.id)
  }, [selectedContact])

  const fetchMessages = async (contactId: string) => {
    try {
      const res = await fetch(`/api/chat?withUserId=${contactId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openContact = (contact: any) => {
    setSelectedContact(contact)
    setShowMobileChat(true)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedContact) return

    const textToSend = inputText.trim()
    setInputText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedContact.id, content: textToSend }),
      })

      if (res.ok) await fetchMessages(selectedContact.id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={currentUser} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex min-h-0">
        <Sidebar role={currentUser?.role || 'STUDENT'} activeTab="chat" />

        <main className="flex-1 min-w-0 min-h-0 p-3 sm:p-4 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6 overflow-hidden h-[calc(100dvh-4rem)]">
          <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex-col shadow-sm min-h-0`}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
              {t('contactsAndChat')}
            </h3>

            <div className="space-y-1 overflow-y-auto flex-1 min-h-0 pr-1">
              {contacts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-10">{t('noUsers')}</p>
              ) : (
                contacts.map((c) => {
                  const isSelected = selectedContact?.id === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => openContact(c)}
                      className={`w-full text-right p-3 rounded-xl transition flex items-center gap-3 ${
                        isSelected
                          ? 'bg-brand-purple text-white shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{c.name}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>{c.role}</p>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex-col overflow-hidden shadow-sm`}>
            {selectedContact ? (
              <>
                <div className="shrink-0 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                    aria-label="العودة لقائمة المحادثات"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{selectedContact.name}</h3>
                    <p className="text-[10px] text-brand-orange font-medium">{selectedContact.role}</p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 p-3 sm:p-4 md:p-6 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50 overscroll-contain">
                  {messages.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-12">{t('startChatNow')}</p>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId === currentUser?.id
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                          <div
                            className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-brand-purple text-white rounded-br-none shadow-sm'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap">{m.content}</p>
                            <span className={`block text-[9px] mt-1 ${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                              {new Date(m.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="shrink-0 p-2.5 sm:p-3 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 sticky bottom-0">
                  <input
                    type="text"
                    placeholder={t('typeMessagePlaceholder')}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-w-0 flex-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="shrink-0 p-3 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t('send')}
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs p-6 text-center">
                {t('selectContactToChat')}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

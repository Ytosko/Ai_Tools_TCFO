import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface AssistantChatProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const EnhancedMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const processInline = (line: string): string => {
        return line
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#E67C15] hover:underline font-semibold">$1</a>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 rounded px-1 py-0.5 text-xs font-mono">$1</code>');
    };

    const html = text
        .split('\n\n')
        .map(block => {
            if (!block.trim()) return '';

            // Headers (unlikely in chat but good to have)
            if (block.startsWith('### ')) return `<h4 class="text-base font-bold mt-3 mb-1 text-gray-800">${processInline(block.substring(4))}</h4>`;
            if (block.startsWith('## ')) return `<h3 class="text-md font-bold mt-3 mb-1 text-gray-900">${processInline(block.substring(3))}</h3>`;

            // Lists (both ul and ol)
            if (block.match(/^(?:\s*[-*]|\s*\d+\.)\s/)) {
                const listItems = block.split('\n').filter(Boolean).map(item => {
                    const content = processInline(item.replace(/^(?:\s*[-*]|\s*\d+\.)\s/, ''));
                    // Simpler list item for chat
                    return `<li class="flex gap-2"><span class="text-[#E67C15] mt-1.5">&#8226;</span><span>${content}</span></li>`;
                }).join('');
                return `<ul class="space-y-1.5">${listItems}</ul>`;
            }

            // Paragraphs
            return `<p class="text-sm text-gray-700 leading-relaxed">${processInline(block).replace(/\n/g, '<br />')}</p>`;
        })
        .join('');

    return <div className="space-y-2" dangerouslySetInnerHTML={{ __html: html }} />;
};

const AssistantChat: React.FC<AssistantChatProps> = ({ messages, isLoading, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden max-w-4xl mx-auto" style={{ width: '100%', margin: 0, maxWidth: '100%' }}>
            <div className="p-4 border-b border-slate-200">
                <h3 className="text-xl font-bold text-gray-900">Domain Assistant</h3>
                <p className="text-sm text-gray-500">Ask follow-up questions about your analysis.</p>
            </div>
            <div className="h-96 bg-slate-50 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-[#E67C15] to-orange-400 rounded-full flex-shrink-0 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        )}
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-slate-200 rounded-bl-none'}`}>
                            {msg.role === 'user' ? (
                                <p className="text-sm">{msg.content}</p>
                            ) : (
                                msg.content ? <EnhancedMarkdown text={msg.content} /> : null
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E67C15]"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssistantChat;
"use client"

import { useState } from "react"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your programming assistant. Ask me anything about programming languages like Java, C, C++, Python, or paste code for explanation!',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Generate intelligent response
    setTimeout(() => {
      const botResponse = generateProgrammingResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  function generateProgrammingResponse(userInput: string): string {
    const input = userInput.toLowerCase()
    
    // Check if user pasted code
    const isCode = /[{;=<>{}\[\]\(\)\n\t]|(function|class|def|if|else|for|while|return|int|void|string|var|let|const|import|include)/.test(userInput)
    
    if (isCode) {
      return analyzeAndExplainCode(userInput)
    }

    // Programming language questions
    if (input.includes('java')) {
      if (input.includes('what') || input.includes('explain')) {
        return `Java is a high-level, object-oriented programming language. Key features:\n\n• Platform-independent (Write Once, Run Anywhere)\n• Automatic garbage collection\n• Strong security features\n• Extensive standard library\n\nCommon uses: Enterprise apps, Android development`
      }
    }

    if (input.includes('python')) {
      if (input.includes('what') || input.includes('explain')) {
        return `Python is known for:\n\n• Clean, readable syntax\n• Dynamic typing\n• Great for AI/ML, web dev\n• Extensive libraries\n\nExample: print("Hello")`
      }
    }

    if (input.includes('c++') || input.includes('cpp')) {
      if (input.includes('what') || input.includes('explain')) {
        return `C++ features:\n\n• Fast performance\n• Object-oriented\n• Manual memory management\n• STL library\n\nUsed in: Game engines, systems`
      }
    }

    if (input.includes('loop')) {
      return `Loops repeat code execution:\n\n1. For Loop: for(int i=0; i<5; i++)\n2. While Loop: while(condition)\n3. Do-While: executes at least once`
    }

    if (input.includes('array')) {
      return `Arrays store multiple values:\n\nJava: int[] arr = {1,2,3}\nC++: int arr[] = {1,2,3}\nPython: arr = [1,2,3]\n\nAccess: arr[0] gives first element`
    }

    if (input.includes('function') || input.includes('method')) {
      return `Functions are reusable code blocks:\n\nJava: returnType func(params) {}\nPython: def func(params):\nC++: type func(params) {}`
    }

    // Default response
    return `I specialize in programming help! Ask me about:\n\n• Java, C, C++, Python\n• Code explanation (paste code)\n• Programming concepts\n• Syntax and best practices`
  }

  function analyzeAndExplainCode(code: string): string {
    let language = 'Unknown'
    if (/public class|System\.out/.test(code)) language = 'Java'
    else if (/#include|cout/.test(code)) language = 'C++'
    else if (/#include.*stdio|printf/.test(code)) language = 'C'
    else if (/^def |^print\(/.test(code)) language = 'Python'

    let explanation = `🔍 Code Analysis (${language}):\n\n`
    const lines = code.split('\n').filter(l => l.trim()).length
    explanation += `Lines: ${lines}\n\n`
    
    const hasFunction = /(function|def |\w+\s*\(|int main)/.test(code)
    const hasLoop = /(for\s*\(|while\s*\()/ .test(code)
    const hasCondition = /(if\s*\(|else)/.test(code)

    explanation += `Components:\n`
    if (hasFunction) explanation += `• Function/Method\n`
    if (hasLoop) explanation += `• Loop structure\n`
    if (hasCondition) explanation += `• Conditional\n`

    explanation += `\nThis ${language} code demonstrates programming logic. Review for clarity, error handling, and proper formatting.`

    return explanation
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        /* Chat Window */
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Support Chat</h3>
                <p className="text-blue-100 text-xs">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                disabled={!inputValue.trim()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

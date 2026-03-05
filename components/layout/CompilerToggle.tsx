"use client"

import { useState } from "react"
import Link from "next/link"

type Language = 'java' | 'c' | 'cpp' | 'python'

interface LanguageOption {
  id: Language
  label: string
  icon: string
  color: string
}

const languages: LanguageOption[] = [
  { id: 'java', label: 'Java', icon: '☕', color: 'bg-orange-500' },
  { id: 'c', label: 'C', icon: '🔧', color: 'bg-blue-600' },
  { id: 'cpp', label: 'C++', icon: '⚡', color: 'bg-indigo-600' },
  { id: 'python', label: 'Python', icon: '🐍', color: 'bg-yellow-500' },
]

export default function CompilerToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python')

  const currentLang = languages.find(lang => lang.id === selectedLanguage)

  return (
    <div className="relative">
      {/* Compiler Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white font-medium text-sm transition-all ${
          currentLang?.color || 'bg-gray-600'
        } hover:opacity-90 shadow-md hover:shadow-lg`}
      >
        <span className="text-lg">{currentLang?.icon}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Select Language
              </h3>
              
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedLanguage === lang.id
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-8 h-8 ${lang.color} rounded-md flex items-center justify-center text-white text-lg`}>
                    {lang.icon}
                  </span>
                  <span className={`font-medium ${
                    selectedLanguage === lang.id ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {lang.label}
                  </span>
                  {selectedLanguage === lang.id && (
                    <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Go to Compiler Link */}
            <div className="border-t border-gray-100 p-2">
              <Link
                href={`/compiler/${selectedLanguage}`}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Compiler
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { notFound } from "next/navigation"

interface CompilerPageProps {
  params: Promise<{ language: string }>
}

export default function CompilerPage({ params }: CompilerPageProps) {
  const [language, setLanguage] = useState<string>("")
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  // Wait for params on client side
  if (typeof window !== 'undefined' && !language) {
    params.then(p => setLanguage(p.language))
  }
  
  const languages: Record<string, { name: string; color: string; icon: string; bgColor: string; sampleCode: string }> = {
    java: { 
      name: 'Java', 
      color: 'text-orange-500', 
      icon: '☕', 
      bgColor: 'bg-orange-600',
      sampleCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    },
    c: { 
      name: 'C', 
      color: 'text-blue-500', 
      icon: '🔧', 
      bgColor: 'bg-blue-600',
      sampleCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
    },
    cpp: { 
      name: 'C++', 
      color: 'text-indigo-500', 
      icon: '⚡', 
      bgColor: 'bg-indigo-600',
      sampleCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
    },
    python: { 
      name: 'Python', 
      color: 'text-yellow-500', 
      icon: '🐍', 
      bgColor: 'bg-yellow-600',
      sampleCode: `print("Hello, World!")`
    },
  }

  const lang = languages[language]
  
  if (!lang) {
    notFound()
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("Compiling and running...\n")
    
    // Simulate compilation/execution delay
    setTimeout(() => {
      setOutput(`Output:\n${lang.name} code executed successfully!\n\nNote: This is a demo. To actually execute code, integrate with a backend compiler API like Judge0 or Piston.`)
      setIsRunning(false)
    }, 1500)
  }

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${getFileExtension(language)}`
    a.click()
    URL.revokeObjectURL(url)
    setOutput("Code saved to downloads folder!")
  }

  const handleClear = () => {
    setCode("")
    setOutput("")
  }

  function getFileExtension(lang: string): string {
    switch(lang) {
      case 'java': return 'java'
      case 'c': return 'c'
      case 'cpp': return 'cpp'
      case 'python': return 'py'
      default: return 'txt'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <span>{lang.icon}</span>
            <span>{lang.name} Compiler</span>
          </h1>
          <p className="text-gray-400">Write and execute {lang.name} code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
            <div className={`${lang.bgColor} px-4 py-2 font-semibold flex justify-between items-center`}>
              <span>Editor</span>
              <button 
                onClick={() => setCode(lang.sampleCode)}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
              placeholder={`// Write your ${lang.name} code here...`}
              spellCheck={false}
            />
          </div>

          {/* Output Console */}
          <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-700 px-4 py-2 font-semibold">
              Output Console
            </div>
            <div className="flex-1 bg-gray-900 p-4 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
              {output || "// Output will appear here..."}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className={`${lang.bgColor} hover:opacity-90 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running...
              </>
            ) : (
              <>
                ▶ Run Code
              </>
            )}
          </button>
          <button 
            onClick={handleSave}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            💾 Save Code
          </button>
          <button 
            onClick={handleClear}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  )
}

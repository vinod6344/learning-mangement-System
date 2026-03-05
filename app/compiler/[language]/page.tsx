"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

const languages: Record<string, { name: string; icon: string; bgColor: string; sampleCode: string }> = {
  java: { 
    name: 'Java', 
    icon: '☕', 
    bgColor: 'bg-orange-600',
    sampleCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
  },
  c: { 
    name: 'C', 
    icon: '🔧', 
    bgColor: 'bg-blue-600',
    sampleCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
  },
  cpp: { 
    name: 'C++', 
    icon: '⚡', 
    bgColor: 'bg-indigo-600',
    sampleCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`
  },
  python: { 
    name: 'Python', 
    icon: '🐍', 
    bgColor: 'bg-yellow-600',
    sampleCode: `print("Hello, World!")`
  },
}

export default function CompilerPage() {
  const params = useParams()
  const language = params.language as string
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const lang = languages[language]
  
  if (!lang) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-400">Language not found</p>
        </div>
      </div>
    )
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("Compiling and running...\n")
    
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

          <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gray-700 px-4 py-2 font-semibold">
              Output Console
            </div>
            <div className="flex-1 bg-gray-900 p-4 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
              {output || "// Output will appear here..."}
            </div>
          </div>
        </div>

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
              <>▶ Run Code</>
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LessonManager from "./LessonManager"

interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl: string
  duration: string | null
  sectionId: number
}

interface Section {
  id: number
  title: string
  order: number
  courseId: string
  lessons: Lesson[]
}

interface SectionManagerProps {
  courseId: string
  initialSections: Section[]
}

export default function SectionManager({ courseId, initialSections }: SectionManagerProps) {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>(initialSections)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault()
    if (!newSectionTitle.trim()) return

    setLoading(true)
    setSuccessMessage("")
    try {
      const res = await fetch(`/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSectionTitle })
      })

      const data = await res.json()

      if (res.ok) {
        setSections([...sections, data.section])
        setNewSectionTitle("")
        setSuccessMessage("Section added successfully! Click on it to add lessons.")
        // Don't refresh immediately - let user see the success message
        setTimeout(() => {
          router.refresh()
        }, 2000)
      } else {
        alert(data.message || "Failed to add section")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleAddSection} className="flex gap-3">
        <input
          type="text"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="New section title (e.g., 'Chapter 1: Introduction')"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !newSectionTitle.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add Section"}
        </button>
      </form>

      {sections.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
          No sections yet. Add your first section above.
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {sections.length} section{sections.length !== 1 ? 's' : ''} found:
          </p>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      Section {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{section.title}</span>
                    <span className="text-sm text-gray-500">
                      ({section.lessons.length} lessons)
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedSection === section.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSection === section.id && (
                  <div className="p-4 bg-white">
                    <LessonManager
                      sectionId={section.id}
                      initialLessons={section.lessons}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

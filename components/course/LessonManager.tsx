"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl: string
  duration: string | null
  sectionId: number
}

interface LessonManagerProps {
  sectionId: number
  initialLessons: Lesson[]
}

export default function LessonManager({ sectionId, initialLessons }: LessonManagerProps) {
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    duration: ""
  })

  function extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const videoId = extractYouTubeId(form.youtubeUrl)
    if (!videoId) {
      alert("Please enter a valid YouTube URL")
      return
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`

    setLoading(true)
    try {
      const res = await fetch(`/api/sections/${sectionId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          youtubeUrl: embedUrl,
          duration: form.duration || null
        })
      })

      const data = await res.json()

      if (res.ok) {
        setLessons([...lessons, data.lesson])
        setForm({ title: "", youtubeUrl: "", duration: "" })
        setShowForm(false)
        router.refresh()
      } else {
        alert(data.message || "Failed to add lesson")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {lessons.length > 0 && (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded min-w-[70px]">
                Lesson {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-900">{lesson.title}</p>
                <p className="text-xs text-gray-500 truncate">{lesson.youtubeUrl}</p>
              </div>
              {lesson.duration && (
                <span className="text-xs text-gray-500">{lesson.duration}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Add Video Lesson
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-md space-y-3">
          <h4 className="font-medium text-gray-900">New Lesson</h4>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Lesson Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., 'Introduction to Variables'"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">YouTube URL *</label>
            <input
              type="url"
              required
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste any YouTube link - it will be converted to an embeddable player
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Duration (optional)</label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g., '10:30' or '1 hour 15 min'"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Lesson"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

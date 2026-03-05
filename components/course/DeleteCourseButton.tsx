"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DeleteCourseButtonProps {
  courseId: string
}

export default function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return

    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        router.refresh()
      } else {
        alert(data.message || "Failed to delete course")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}

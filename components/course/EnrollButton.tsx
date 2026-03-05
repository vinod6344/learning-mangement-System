"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface EnrollButtonProps {
  courseId: string
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEnroll() {
    setLoading(true)
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId })
      })

      if (res.ok) {
        router.refresh()
        router.push(`/learn/${courseId}`)
      } else {
        const data = await res.json()
        alert(data.message || "Failed to enroll")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Enrolling..." : "Enroll Now"}
    </button>
  )
}

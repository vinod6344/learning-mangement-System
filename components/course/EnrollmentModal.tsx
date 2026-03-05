"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface EnrollmentModalProps {
  courseId: string
  courseTitle: string
  price: number | null
  onClose: () => void
}

export default function EnrollmentModal({ courseId, courseTitle, price, onClose }: EnrollmentModalProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    phone: "",
    message: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          studentName: form.studentName || session?.user?.name,
          studentEmail: form.studentEmail || session?.user?.email,
          phone: form.phone,
          message: form.message,
          price: price || 0
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to payment if paid course, otherwise to course
        if (price && price > 0) {
          // For now, we'll just redirect to the course
          // Later you can integrate payment gateway here
          alert("Payment integration coming soon! For now, enrolling in free mode.")
        }
        router.refresh()
        router.push(`/learn/${courseId}`)
      } else {
        alert(data.message || "Failed to enroll")
      }
    } catch (error) {
      console.error("Enrollment error:", error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Enroll in Course</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Course Info */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900">{courseTitle}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {price && price > 0 ? (
                <span className="text-green-700 font-semibold">Price: ${price}</span>
              ) : (
                <span className="text-green-700 font-semibold">FREE Course</span>
              )}
            </p>
          </div>

          {/* Student Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={form.studentName}
              onChange={(e) => setForm({ ...form, studentName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={form.studentEmail}
              onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (optional)
            </label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any questions or special requests..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : price && price > 0
                ? `Pay $${price} & Enroll`
                : "Enroll for Free"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EnrollmentModal from "./EnrollmentModal"

interface EnrollButtonProps {
  courseId: string
  courseTitle?: string
  price?: number | null
}

export default function EnrollButton({ courseId, courseTitle = "", price = null }: EnrollButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        {price && price > 0 ? `Enroll - $${price}` : "Enroll Now"}
      </button>

      {showModal && (
        <EnrollmentModal
          courseId={courseId}
          courseTitle={courseTitle}
          price={price}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

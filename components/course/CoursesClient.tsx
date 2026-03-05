"use client"

import { useState } from "react"
import Link from "next/link"
import EnrollButton from "./EnrollButton"
import DeleteCourseButton from "./DeleteCourseButton"
import CourseUploadModal from "./CourseUploadModal"

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

interface Enrollment {
  id: string
  enrolledAt: string
  userId: string
  courseId: string
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  category: string
  createdAt: string
  updatedAt: string
  instructorId: string
  instructor: { id: string; name: string }
  sections: Section[]
  enrollments: Enrollment[]
}

interface CoursesClientProps {
  courses: Course[]
  isInstructor: boolean
  currentUserId: string
}

export default function CoursesClient({ courses, isInstructor, currentUserId }: CoursesClientProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isInstructor ? "Manage Courses" : "Browse Courses"}
        </h1>
        {isInstructor && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            + Upload Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">No courses available yet.</p>
          {isInstructor && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Create your first course
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const lessonsCount = course.sections.reduce(
              (acc, section) => acc + section.lessons.length,
              0
            )
            const isEnrolled = course.enrollments.length > 0
            const isOwner = course.instructorId === currentUserId

            return (
              <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No thumbnail</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-gray-500 mb-2">{course.category}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Instructor: {course.instructor.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{lessonsCount} lessons</span>

                    {/* Instructor: show Delete for own courses */}
                    {isInstructor ? (
                      isOwner ? (
                        <DeleteCourseButton courseId={course.id} />
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not your course</span>
                      )
                    ) : (
                      /* Student: Enroll or Continue */
                      isEnrolled ? (
                        <Link
                          href={`/learn/${course.id}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                        >
                          Continue
                        </Link>
                      ) : (
                        <EnrollButton courseId={course.id} />
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showUploadModal && (
        <CourseUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  )
}

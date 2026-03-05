"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Play } from "lucide-react"

interface Lesson {
  id: string
  title: string
  order: number
  youtubeUrl: string
  duration: string | null
  sectionTitle: string
}

interface Course {
  id: string
  title: string
  instructor: { name: string }
  sections: {
    id: number
    title: string
    order: number
    lessons: {
      id: string
      title: string
      order: number
    }[]
  }[]
}

interface LearningClientProps {
  course: Course
  currentLesson: Lesson
  nextLesson: Lesson | undefined
  prevLesson: Lesson | undefined
  allLessons: Lesson[]
  completedLessonIds: Set<string>
  progressPercentage: number
  userId: string
}

export default function LearningClient({
  course,
  currentLesson,
  nextLesson,
  prevLesson,
  allLessons,
  completedLessonIds,
  progressPercentage,
  userId
}: LearningClientProps) {
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(completedLessonIds.has(currentLesson.id))
  const [loading, setLoading] = useState(false)

  function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  async function markComplete() {
    setLoading(true)
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: !isCompleted
        })
      })

      if (res.ok) {
        setIsCompleted(!isCompleted)
        router.refresh()
      }
    } catch (error) {
      console.error("Error marking progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const youtubeId = getYouTubeId(currentLesson.youtubeUrl)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="aspect-video bg-black">
            {youtubeId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={currentLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <Play className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
              <button
                onClick={markComplete}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Completed
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5" />
                    Mark Complete
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-6">
              {prevLesson ? (
                <Link
                  href={`/learn/${course.id}?lesson=${prevLesson.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${course.id}?lesson=${nextLesson.id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
          <p className="text-gray-600">Instructor: {course.instructor.name}</p>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-900">Course Content</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {course.sections.map((section) => (
              <div key={section.id} className="border-b last:border-b-0">
                <div className="px-4 py-3 bg-gray-50 font-medium text-gray-900">
                  {section.title}
                </div>
                <div>
                  {section.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLesson.id
                    const isCompleted = completedLessonIds.has(lesson.id)
                    const lessonData = allLessons.find(l => l.id === lesson.id)

                    return (
                      <Link
                        key={lesson.id}
                        href={`/learn/${course.id}?lesson=${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
                          isCurrent ? "bg-blue-50 border-l-4 border-blue-600" : ""
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${isCurrent ? "font-medium text-blue-900" : "text-gray-700"}`}>
                            {lesson.title}
                          </p>
                          {lessonData?.duration && (
                            <p className="text-xs text-gray-500">{lessonData.duration}</p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

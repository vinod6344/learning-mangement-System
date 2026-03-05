import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import SectionManager from "@/components/course/SectionManager"

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "INSTRUCTOR") {
    redirect("/courses")
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        include: { lessons: true },
        orderBy: { order: "asc" }
      }
    }
  })

  if (!course) {
    notFound()
  }

  if (course.instructorId !== session.user.id) {
    redirect("/courses")
  }

  const serializedSections = course.sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({ ...lesson }))
  }))

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/courses"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded" />
            ) : (
              <span className="text-gray-400 text-xs">No thumbnail</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">{course.description}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Category: {course.category}</span>
              <span>{course.sections.length} sections</span>
              <span>
                {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
        <p className="text-gray-600 text-sm mb-6">
          Organize your course into sections and add video lessons with YouTube links.
        </p>
        <SectionManager courseId={course.id} initialSections={serializedSections} />
      </div>
    </div>
  )
}

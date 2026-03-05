import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import EnrollButton from "@/components/course/EnrollButton"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: { name: true }
      },
      sections: {
        include: {
          lessons: true
        }
      },
      enrollments: {
        where: { userId: session.user.id }
      }
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Courses</h1>

      {courses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const lessonsCount = course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
            const isEnrolled = course.enrollments.length > 0

            return (
              <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
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
                    {isEnrolled ? (
                      <Link
                        href={`/learn/${course.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                      >
                        Continue
                      </Link>
                    ) : (
                      <EnrollButton courseId={course.id} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

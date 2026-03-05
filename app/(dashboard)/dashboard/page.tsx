import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteCourseButton from "@/components/course/DeleteCourseButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const isInstructor = session.user.role === "INSTRUCTOR"

  if (isInstructor) {
    // --- INSTRUCTOR DASHBOARD ---
    const myCourses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      include: {
        sections: { include: { lessons: true } },
        enrollments: true
      }
    })

    const totalStudents = myCourses.reduce((acc, c) => acc + c.enrollments.length, 0)
    const totalLessons = myCourses.reduce(
      (acc, c) => acc + c.sections.reduce((s, sec) => s + sec.lessons.length, 0),
      0
    )

    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {session.user.name}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">My Courses</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{myCourses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalStudents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Lessons</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalLessons}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <Link
            href="/courses"
            className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            + Upload Course
          </Link>
        </div>

        {myCourses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 mb-4">You haven&apos;t created any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => {
              const lessonsCount = course.sections.reduce(
                (acc, section) => acc + section.lessons.length,
                0
              )
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
                    <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {lessonsCount} lessons &bull; {course.enrollments.length} students enrolled
                    </p>
                    <div className="flex justify-end">
                      <DeleteCourseButton courseId={course.id} />
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

  // --- STUDENT DASHBOARD ---
  const userCourses = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: {
            select: { name: true }
          },
          sections: {
            include: {
              lessons: true
            }
          }
        }
      }
    }
  })

  const totalLessons = userCourses.reduce((acc, enrollment) => {
    return acc + enrollment.course.sections.reduce((sectionAcc, section) => {
      return sectionAcc + section.lessons.length
    }, 0)
  }, 0)

  const completedLessons = await prisma.progress.count({
    where: {
      userId: session.user.id,
      completed: true
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {session.user.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{userCourses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Lessons</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalLessons}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{completedLessons}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
      
      {userCourses.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((enrollment) => {
            const course = enrollment.course
            const lessonsCount = course.sections.reduce((acc, section) => acc + section.lessons.length, 0)
            
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
                  <p className="text-sm text-gray-600 mb-4">{course.category}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Instructor: {course.instructor.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{lessonsCount} lessons</span>
                    <Link
                      href={`/learn/${course.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                    >
                      Continue Learning
                    </Link>
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

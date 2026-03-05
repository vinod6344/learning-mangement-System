import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CoursesClient from "@/components/course/CoursesClient"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const isInstructor = session.user.role === "INSTRUCTOR"

  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: { id: true, name: true }
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

  const serializedCourses = courses.map((course) => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
    sections: course.sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({ ...lesson }))
    }))
  }))

  return (
    <CoursesClient
      courses={serializedCourses}
      isInstructor={isInstructor}
      currentUserId={session.user.id}
    />
  )
}

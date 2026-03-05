import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import LearningClient from "@/components/lesson/LearningClient"

interface LearnPageProps {
  params: Promise<{
    courseId: string
  }>
  searchParams: Promise<{
    lesson?: string
  }>
}

export default async function LearnPage({ params, searchParams }: LearnPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { courseId } = await params
  const { lesson } = await searchParams

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId
      }
    }
  })

  if (!enrollment) {
    redirect("/courses")
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { name: true }
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" }
          }
        }
      }
    }
  })

  if (!course) {
    redirect("/courses")
  }

  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lesson: {
        section: {
          courseId: courseId
        }
      }
    }
  })

  const completedLessonIds = new Set(progress.filter(p => p.completed).map(p => p.lessonId))

  const allLessons = course.sections.flatMap(section => 
    section.lessons.map(lesson => ({ ...lesson, sectionTitle: section.title }))
  )

  const currentLessonId = lesson || allLessons[0]?.id
  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0]

  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const totalLessons = allLessons.length
  const completedCount = allLessons.filter(l => completedLessonIds.has(l.id)).length
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <LearningClient
      course={course}
      currentLesson={currentLesson}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
      allLessons={allLessons}
      completedLessonIds={completedLessonIds}
      progressPercentage={progressPercentage}
      userId={session.user.id}
    />
  )
}

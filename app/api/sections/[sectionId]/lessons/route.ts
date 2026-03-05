import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Only instructors can add lessons" }, { status: 403 })
    }

    const { sectionId } = await params
    const { title, youtubeUrl, duration } = await req.json()

    if (!title || !youtubeUrl) {
      return NextResponse.json({ message: "Title and YouTube URL are required" }, { status: 400 })
    }

    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
      include: { course: true }
    })

    if (!section) {
      return NextResponse.json({ message: "Section not found" }, { status: 404 })
    }

    if (section.course.instructorId !== session.user.id) {
      return NextResponse.json({ message: "You can only edit your own courses" }, { status: 403 })
    }

    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId: parseInt(sectionId) },
      orderBy: { order: "desc" }
    })

    const newOrder = lastLesson ? lastLesson.order + 1 : 1

    const lesson = await prisma.lesson.create({
      data: {
        title,
        youtubeUrl,
        duration: duration || null,
        order: newOrder,
        sectionId: parseInt(sectionId)
      }
    })

    return NextResponse.json({ message: "Lesson created", lesson }, { status: 201 })
  } catch (error) {
    console.error("Create lesson error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params

    const lessons = await prisma.lesson.findMany({
      where: { sectionId: parseInt(sectionId) },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error("Get lessons error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

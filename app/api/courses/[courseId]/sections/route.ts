import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Only instructors can add sections" }, { status: 403 })
    }

    const { courseId } = params
    const { title } = await req.json()

    if (!title) {
      return NextResponse.json({ message: "Section title is required" }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    if (course.instructorId !== session.user.id) {
      return NextResponse.json({ message: "You can only edit your own courses" }, { status: 403 })
    }

    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { order: "desc" }
    })

    const newOrder = lastSection ? lastSection.order + 1 : 1

    const section = await prisma.section.create({
      data: {
        title,
        order: newOrder,
        courseId
      }
    })

    return NextResponse.json({ message: "Section created", section }, { status: 201 })
  } catch (error) {
    console.error("Create section error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const sections = await prisma.section.findMany({
      where: { courseId },
      include: { lessons: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({ sections })
  } catch (error) {
    console.error("Get sections error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

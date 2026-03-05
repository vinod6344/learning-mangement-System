import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Only instructors can delete courses" }, { status: 403 })
    }

    const { courseId } = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 })
    }

    if (course.instructorId !== session.user.id) {
      return NextResponse.json({ message: "You can only delete your own courses" }, { status: 403 })
    }

    await prisma.course.delete({
      where: { id: courseId }
    })

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete course error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

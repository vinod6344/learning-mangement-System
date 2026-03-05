import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ message: "Only instructors can create courses" }, { status: 403 })
    }

    const { title, description, category, thumbnail } = await req.json()

    if (!title || !description || !category) {
      return NextResponse.json({ message: "Title, description and category are required" }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        thumbnail: thumbnail || null,
        instructorId: session.user.id
      }
    })

    return NextResponse.json({ message: "Course created successfully", course }, { status: 201 })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

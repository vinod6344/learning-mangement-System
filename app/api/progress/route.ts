import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { lessonId, completed } = await req.json()

    if (!lessonId) {
      return NextResponse.json(
        { message: "Lesson ID is required" },
        { status: 400 }
      )
    }

    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId
        }
      }
    })

    if (existingProgress) {
      const updated = await prisma.progress.update({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: lessonId
          }
        },
        data: {
          completed,
          completedAt: completed ? new Date() : null
        }
      })

      return NextResponse.json(
        { message: "Progress updated", progress: updated },
        { status: 200 }
      )
    } else {
      const created = await prisma.progress.create({
        data: {
          userId: session.user.id,
          lessonId: lessonId,
          completed,
          completedAt: completed ? new Date() : null
        }
      })

      return NextResponse.json(
        { message: "Progress created", progress: created },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Progress error:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}

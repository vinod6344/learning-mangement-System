import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update all existing courses to have price = 0 (free)
  const result = await prisma.course.updateMany({
    where: {
      price: null
    },
    data: {
      price: 0
    }
  })

  console.log(`Updated ${result.count} courses with price = 0 (FREE)`)

  // Show all courses with their prices
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      price: true
    }
  })

  console.log('\nAll courses:')
  courses.forEach(course => {
    console.log(`${course.title} - $${course.price || 0}`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

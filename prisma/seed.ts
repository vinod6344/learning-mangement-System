import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

async function main() {
  // Create instructor
  const instructorPassword = await bcrypt.hash('password123', 10)
  
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      email: 'instructor@example.com',
      name: 'John Instructor',
      password: instructorPassword,
      role: 'INSTRUCTOR'
    }
  })

  // Create student
  const studentPassword = await bcrypt.hash('password123', 10)
  
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Jane Student',
      password: studentPassword,
      role: 'STUDENT'
    }
  })

  console.log('Created users:', { instructor: instructor.email, student: student.email })

  // Create a sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
      category: 'Programming',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Getting Started',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Course Introduction',
                  order: 1,
                  youtubeUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
                  duration: '5:30'
                },
                {
                  title: 'Setting Up Your Environment',
                  order: 2,
                  youtubeUrl: 'https://www.youtube.com/watch?v=Hf4MJH0jDb4',
                  duration: '10:15'
                }
              ]
            }
          },
          {
            title: 'HTML Basics',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'What is HTML?',
                  order: 1,
                  youtubeUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
                  duration: '12:00'
                },
                {
                  title: 'HTML Document Structure',
                  order: 2,
                  youtubeUrl: 'https://www.youtube.com/watch?v=ieTHC78giGQ',
                  duration: '15:30'
                },
                {
                  title: 'Common HTML Tags',
                  order: 3,
                  youtubeUrl: 'https://www.youtube.com/watch?v=KJ13lYiMrHc',
                  duration: '20:00'
                }
              ]
            }
          },
          {
            title: 'CSS Fundamentals',
            order: 3,
            lessons: {
              create: [
                {
                  title: 'Introduction to CSS',
                  order: 1,
                  youtubeUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
                  duration: '18:45'
                },
                {
                  title: 'CSS Selectors',
                  order: 2,
                  youtubeUrl: 'https://www.youtube.com/watch?v=l1mER1bV0N0',
                  duration: '14:20'
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Created course:', course.title)

  // Create another course
  const course2 = await prisma.course.create({
    data: {
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python. Learn syntax, data types, and build real projects.',
      category: 'Programming',
      instructorId: instructor.id,
      sections: {
        create: [
          {
            title: 'Python Basics',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Introduction to Python',
                  order: 1,
                  youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                  duration: '45:00'
                },
                {
                  title: 'Variables and Data Types',
                  order: 2,
                  youtubeUrl: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY',
                  duration: '20:00'
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('Created course:', course2.title)

  // Enroll student in first course
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id
    }
  })

  console.log('Enrolled student in course:', course.title)

  console.log('\nSeed data created successfully!')
  console.log('\nTest Accounts:')
  console.log('Instructor: instructor@example.com / password123')
  console.log('Student: student@example.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    // Delete all sessions
    await prisma.session.deleteMany({})
    console.log('All sessions have been deleted')

    // Delete all accounts
    await prisma.account.deleteMany({})
    console.log('All accounts have been deleted')

    // Delete all users
    await prisma.user.deleteMany({})
    console.log('All users have been deleted')

    // If you have other related tables, you might want to clear them as well
    // For example:
    // await prisma.notes.deleteMany({})
    // console.log('All notes have been deleted')

    console.log('Database cleared successfully')
  } catch (error) {
    console.error('Error clearing database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()
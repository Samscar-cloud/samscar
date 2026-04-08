import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }
  return session
}

export async function logAdminAction(userId: string, action: string, details?: string) {
  await prisma.adminAction.create({
    data: { userId, action, details },
  })
}

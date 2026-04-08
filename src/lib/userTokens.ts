import { randomBytes } from 'crypto'
import { prisma } from './prisma'

export type UserTokenType = 'PASSWORD_RESET' | 'EMAIL_VERIFICATION'

const DEFAULT_TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 3 // 3 hours

export async function createUserToken(userId: string, type: UserTokenType) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + DEFAULT_TOKEN_LIFETIME_MS)

  return prisma.userToken.create({
    data: {
      userId,
      type,
      token,
      expiresAt,
    },
  })
}

export async function getUserToken(token: string, type: UserTokenType) {
  return prisma.userToken.findFirst({
    where: {
      token,
      type,
      expiresAt: {
        gt: new Date(),
      },
    },
  })
}

export async function consumeUserToken(id: string) {
  return prisma.userToken.delete({
    where: {
      id,
    },
  })
}

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from '@/infrastructure/prisma/client'

/** Better Auth 密码最短长度（与注册页 HTML minLength 保持一致） */
export const MIN_PASSWORD_LENGTH = 8

/** Better Auth 实例：邮箱密码登录，Session 持久化到 Neon（经 Prisma） */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
  },
  // Server Action 中 signIn/signUp 需通过此插件把 Set-Cookie 写入浏览器
  plugins: [nextCookies()],
})

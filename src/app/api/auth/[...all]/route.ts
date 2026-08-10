import { auth } from '@/infrastructure/auth/better-auth'
import { toNextJsHandler } from 'better-auth/next-js'

/** Better Auth 的 HTTP 入口：处理登录、注册、登出等 /api/auth/* 请求 */
export const { GET, POST } = toNextJsHandler(auth)

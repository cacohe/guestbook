import { BetterAuthRepository } from '@/infrastructure/auth/auth-repository'
import { PrismaMessageRepository } from '@/infrastructure/prisma/message-repository'

/** 仓储单例：切换数据库或认证方案时，只需替换此处的实现类 */
export const authRepository = new BetterAuthRepository()
export const messageRepository = new PrismaMessageRepository()

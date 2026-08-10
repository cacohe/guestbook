import { UnauthorizedError, ValidationError } from '@/domain/errors'
import { MessageSchema, type Message } from '@/domain/message'
import type { AuthRepository } from '@/repositories/auth-repository'
import type { MessageRepository } from '@/repositories/message-repository'
import { authRepository, messageRepository } from '@/repositories'

/** 留言业务逻辑：鉴权、Zod 校验、调用仓储持久化 */
export class MessageService {
  constructor(
    private readonly messages: MessageRepository = messageRepository,
    private readonly auth: AuthRepository = authRepository
  ) {}

  async listMessages(): Promise<Message[]> {
    return this.messages.findAllOrderedByNewest()
  }

  async createMessage(content: unknown): Promise<void> {
    const user = await this.auth.getCurrentUser()

    if (!user) {
      throw new UnauthorizedError()
    }

    const validated = MessageSchema.safeParse({ content })

    if (!validated.success) {
      throw new ValidationError(
        validated.error.flatten().fieldErrors.content?.[0] ?? '输入无效'
      )
    }

    await this.messages.create({
      content: validated.data.content,
      userId: user.id,
    })
  }
}

export const messageService = new MessageService()

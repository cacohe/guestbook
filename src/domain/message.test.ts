import { describe, expect, it } from 'vitest'
import { MessageSchema } from '@/domain/message'

describe('MessageSchema', () => {
  it('accepts valid content', () => {
    const result = MessageSchema.safeParse({ content: '你好，世界' })
    expect(result.success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = MessageSchema.safeParse({ content: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.content?.[0]).toBe(
        '留言不能为空'
      )
    }
  })

  it('rejects content longer than 200 characters', () => {
    const result = MessageSchema.safeParse({ content: 'a'.repeat(201) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.content?.[0]).toBe('最多200字')
    }
  })
})

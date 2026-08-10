import type { AuthRepository } from '@/repositories/auth-repository'
import { authRepository } from '@/repositories'

/** 认证业务逻辑：编排登录、注册、登出，不包含具体 Auth SDK 调用 */
export class AuthService {
  constructor(private readonly auth: AuthRepository = authRepository) {}

  async login(email: string, password: string): Promise<void> {
    await this.auth.signInWithPassword(email, password)
  }

  async signup(email: string, password: string): Promise<void> {
    await this.auth.signUp(email, password)
  }

  async logout(): Promise<void> {
    await this.auth.signOut()
  }
}

export const authService = new AuthService()

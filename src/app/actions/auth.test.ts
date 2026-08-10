import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InvalidCredentialsError, RegistrationError } from '@/domain/errors'

const { loginMock, signupMock, logoutMock, redirectMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  signupMock: vi.fn(),
  logoutMock: vi.fn(),
  redirectMock: vi.fn(),
}))

vi.mock('@/services/auth-service', () => ({
  authService: {
    login: loginMock,
    signup: signupMock,
    logout: logoutMock,
  },
}))

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    redirectMock(url)
    throw new Error('NEXT_REDIRECT')
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('auth actions', () => {
  beforeEach(() => {
    loginMock.mockReset()
    signupMock.mockReset()
    logoutMock.mockReset()
    redirectMock.mockReset()
  })

  it('redirects to login with error when credentials are invalid', async () => {
    loginMock.mockRejectedValue(new InvalidCredentialsError())

    const { login } = await import('@/app/actions/auth')
    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('password', 'wrong-password')

    await expect(login(formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectMock).toHaveBeenCalledWith(
      `/login?error=${encodeURIComponent('邮箱或密码不正确')}`
    )
  })

  it('redirects home after successful login', async () => {
    loginMock.mockResolvedValue(undefined)

    const { login } = await import('@/app/actions/auth')
    const formData = new FormData()
    formData.set('email', 'user@example.com')
    formData.set('password', 'secret123')

    await expect(login(formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectMock).toHaveBeenCalledWith('/')
  })

  it('redirects home after successful signup', async () => {
    signupMock.mockResolvedValue(undefined)

    const { signup } = await import('@/app/actions/auth')
    const formData = new FormData()
    formData.set('email', 'new@example.com')
    formData.set('password', 'secret123')

    await expect(signup(formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectMock).toHaveBeenCalledWith('/')
  })

  it('redirects to signup with error when registration fails', async () => {
    signupMock.mockRejectedValue(new RegistrationError())

    const { signup } = await import('@/app/actions/auth')
    const formData = new FormData()
    formData.set('email', 'existing@example.com')
    formData.set('password', 'secret123')

    await expect(signup(formData)).rejects.toThrow('NEXT_REDIRECT')

    expect(redirectMock).toHaveBeenCalledWith(
      `/signup?error=${encodeURIComponent('注册失败，请检查邮箱或密码')}`
    )
  })
})

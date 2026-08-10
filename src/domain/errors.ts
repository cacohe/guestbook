/** 领域层基础异常，所有业务错误均继承此类 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = '请先登录') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class PersistenceError extends DomainError {
  constructor(message = '数据保存失败') {
    super(message)
    this.name = 'PersistenceError'
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = '邮箱或密码不正确') {
    super(message)
    this.name = 'InvalidCredentialsError'
  }
}

export class RegistrationError extends DomainError {
  constructor(message = '注册失败，请检查邮箱或密码') {
    super(message)
    this.name = 'RegistrationError'
  }
}

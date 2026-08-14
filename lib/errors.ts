export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'طلب غير صحيح') {
    super(message, 400)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'غير مصرح لك') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'ممنوع الوصول') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'غير موجود') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'تعارض في البيانات') {
    super(message, 409)
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'خطأ في الخادم') {
    super(message, 500)
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      statusCode: 500,
    }
  }

  return {
    success: false,
    error: 'حدث خطأ غير متوقع',
    statusCode: 500,
  }
}

export class ResponseError extends Error {
  statusCode: number = 400;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ResponseError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends ResponseError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends ResponseError {
  constructor(message: string) {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ResponseError {
  constructor(message: string) {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

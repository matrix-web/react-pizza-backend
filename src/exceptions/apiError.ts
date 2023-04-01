class ApiError extends Error {
  status: number;
  errors?: any[];

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static internalServerError(message: string, errors: any[]) {
    return new ApiError(500, message, errors);
  }
}

export default ApiError;

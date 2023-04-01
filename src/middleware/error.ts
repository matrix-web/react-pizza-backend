import { Request, Response, NextFunction } from 'express';

import ApiError from '../exceptions/apiError';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({ message: 'Something went wrong' });
}

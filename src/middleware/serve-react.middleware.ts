import { Request, Response, NextFunction } from 'express';
import { join } from 'path';

export function serveReactMiddleware(req: Request, res: Response, next: NextFunction) {
  // If the request is not for an API endpoint, serve the React app
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  } else {
    next();
  }
}

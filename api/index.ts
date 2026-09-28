import app from '../server.ts';
import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  return app(req, res);
}

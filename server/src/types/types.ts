import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export interface MyContext {
  req: Request & { session: any };
  redis: Redis;
  res: Response;
}

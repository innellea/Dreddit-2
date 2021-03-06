import { Request, Response } from 'express';

import { Redis } from 'ioredis';

import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';
// @ts-ignore
export type MyContext = {
    // @ts-ignore
    req: Request & { session: Express.Session };
    redis: Redis;
    res: Response;
    userLoader: ReturnType<typeof createUserLoader>;
    updootLoader: ReturnType<typeof createUpdootLoader>;
};

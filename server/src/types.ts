import { IDatabaseDriver, Connection, EntityManager } from '@mikro-orm/core';

import { Request, Response } from 'express';

import { Session } from 'express-session';
export interface MyContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session?: Session & { userId?: number }; res: Response };

  res: Response;
}

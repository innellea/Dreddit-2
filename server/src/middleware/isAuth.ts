import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../types';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  // TODO: Check if user is logged in
  if (!context.req.session.userId) {
    throw new Error('not authenticated');
  }

  return next();
};

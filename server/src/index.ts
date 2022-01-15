import 'reflect-metadata';

import express from 'express';

import { ApolloServer } from 'apollo-server-express';

import { buildSchema } from 'type-graphql';

import session from 'express-session';

import connectRedis from 'connect-redis';

import Redis from 'ioredis';

import cors from 'cors';

import { createConnection } from 'typeorm';

import { __prod__, COOKIE_NAME } from './constants';

import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const cookieParser = require('cookie-parser');
// const redis = Redis();
const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'dreddit',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    // synchronize: true,
    entities: [Post, User],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: '*',
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        
      },
      saveUninitialized: true,
      secret: 'qowiueojwojfalksdjoqiwueo',
      resave: false,
    }),
    cookieParser()
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res,  }) => ({ req, res, redis }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((err) => {
  console.error(err);
});

import 'reflect-metadata';

import { MikroORM, ServerException } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import cors from 'cors';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  //TODO: Change cors policy to production

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
        disableTTL: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: false,
        sameSite: 'lax', // csrf
      },
      saveUninitialized: false,
      secret: 'secret',
      resave: false,
    })
  );
  //
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
    // optional plugin for graphiQl playground
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
  });

  //
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log('listening on 4000');
  });
};
main().catch((err) => {
  console.error(err);
});

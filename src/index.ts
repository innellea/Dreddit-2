import 'reflect-metadata';

import { MikroORM, ServerException } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { credentials: true, origin: true },
  });

  app.listen(4000, () => {
    console.log('listening on 4000');
  });
};
main().catch((err) => {
  console.error(err);
});

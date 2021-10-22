import { MikroORM } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();
  app.get('/', (_, res) => {
    res.send('Hello World');
  });
  app.listen(4000, () => {
    console.log('listening on 4000');
  });
};

main().catch((err) => {
  console.error(err);
});

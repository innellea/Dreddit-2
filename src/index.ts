import { MikroORM } from '@mikro-orm/core';
import { Migration } from '@mikro-orm/migrations';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';
const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();
  const post = orm.em.create(Post, { title: 'my first post' });
  await orm.em.persistAndFlush(post);
};

main().catch((err) => {
  console.error(err);
});

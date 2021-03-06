/* eslint-disable simple-import-sort/imports */
import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';

import connectRedis from 'connect-redis';

import cors from 'cors';

import express from 'express';

import session from 'express-session';

import Redis from 'ioredis';

import path from 'node:path';

import { buildSchema } from 'type-graphql';

import { createConnection } from 'typeorm';

import { env } from 'node:process';

import { __prod__, COOKIE_NAME } from './constants';

import { Post } from './entities/Post';
import { Updoot } from './entities/Updoot';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        logging: true,
        url: process.env.DATABASE_URL,
        migrations: [path.join(__dirname, './migrations/*')],
        entities: [Post, User, Updoot]
    });
    await conn.runMigrations();
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    app.set('proxy', 1);
    app.use(
        cors({
            // origin: '*',
            origin: __prod__
                ? process.env.CORS_ORIGIN
                : process.env.CORS_ORIGIN_DEV,
            credentials: true
        })
    );

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie only works in https
                domain: __prod__ ? '.dreddit.uk' : undefined
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            updootLoader: createUpdootLoader()
        })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000),
        () => {
            console.log('server started on localhost:4000');
        };
};

main().catch((error) => {
    console.error(error);
});

import "reflect-metadata"

import path from "path"

import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from 'express';
import { createServer } from 'http';

// import { makeExecutableSchema } from '@graphql-tools/schema';
// import { WebSocketServer } from 'ws';

// import { useServer } from 'graphql-ws/lib/use/ws';

import { buildSchema } from "type-graphql"
import { UserResolver } from "./resolver/UserResolver";

const app = express();
app.use(express.json());

const httpServer = createServer(app);


(async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql')
  });

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), ApolloServerPluginLandingPageLocalDefault({ embed: true })]
  })

  await server.start();
  
  server.applyMiddleware(({
    app,
    path: '/',
  }))

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})()
import "reflect-metadata"

import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";
import multer from "multer";
import cors from "cors";

// @ts-ignore
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";

// import FileController from "./controllers/FileController"

import { connect } from "./config/database";
// import multerConfig from "./config/multer";
import { authMiddleware } from "./middlewares/auth";
import { routes } from "./routes";

(async () => {
  await connect();
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: ["http://localhost:5173", "https://flingr.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));

  // criar controllers de login e signup, serão rotas livres
  app.use(routes)
  // app.use(authMiddleware);

  // const upload = multer(multerConfig);
  // app.post('/upload', upload.single('file'), FileController.store);

  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ]
  })

  await server.start();
  
  server.applyMiddleware(({ app, path: '/graphql' }))

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at ${server.graphqlPath}`);
})()
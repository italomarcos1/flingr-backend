import { Router } from 'express';
import { usersRouter } from './UsersRouter';
import { sessionsRouter } from './SessionsRouter';

const routes = Router();

routes.use("/register", usersRouter);
routes.use("/auth", sessionsRouter);

export { routes };
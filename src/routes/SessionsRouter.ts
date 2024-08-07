import { Router } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { AppError } from '../errors/AppError';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;
    
    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // @ts-ignore
    delete user.password;

    return response.json({ user, token });
  } catch (err) {
      console.log("e", err)
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
  }
});

export { sessionsRouter };
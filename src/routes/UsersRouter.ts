import { Router } from 'express';
// import multer from 'multer';
// import multerConfig from '../config/multer';

import { CreateUserService } from '../services/CreateUserService';
// import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { AppError } from '../errors/AppError';

const usersRouter = Router();
// const upload = multer(multerConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password, profilePicture } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
      profilePicture: profilePicture ?? null
    });

    return response.json(user);
  } catch (err) {
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

export { usersRouter };
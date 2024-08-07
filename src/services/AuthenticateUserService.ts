import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { User } from '../models/User';
import { authConfig } from '../config/auth';
import { AppError } from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

export class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const user = await User.findOne({ where: { email } });
    
    if (!user)
      throw new AppError('Incorrect email/password combination', 400);

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch)
      throw new AppError("Incorrect email/password combination", 400);

    const { secret, expiresIn } = authConfig;

    const token = sign({ id: user.id }, secret, { expiresIn });

    return { user, token };
  }
}
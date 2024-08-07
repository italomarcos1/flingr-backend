import { hash } from 'bcryptjs';
import { User } from '../models/User';

import { AppError } from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
}

class CreateUserService {
  public async execute({ name, email, password, profilePicture }: Request): Promise<User> {
    const checkUserExists = await User.findOne({ where: { email } });

    if (checkUserExists) {
      throw new AppError("Esse e-mail já está sendo utilizado.", 401);
    }

    const hashedPassword = await hash(password, 8);

    const user = Object.assign(new User(), {
      name,
      email,
      password,
      age: 20,
      bio: "teste",
      gender: "Triceratops",
      passwordHash: hashedPassword,
      profilePicture
    })

    await user.save();

    // @ts-ignore
    delete user.password;

    return user;
  }
}

export { CreateUserService };
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import crypto from 'crypto';

import { User } from "../models/User";

@Resolver()
export class UserResolver {
  private users: User[] = [];

  @Query(() => [User])
  async index(): Promise<User[]> {
    return this.users
  }

  @Mutation(() => User)
  async createUser(@Arg('name') name: string): Promise<User> {
    const user = {
      id: crypto.randomUUID(),
      name
    }

    this.users.push(user);

    return user;
  }
}
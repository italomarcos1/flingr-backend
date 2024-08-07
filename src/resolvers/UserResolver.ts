// @ts-nocheck
import { In } from 'typeorm';

import { Like } from '../models/Like';
import { Message, MessagePayload } from '../models/Message';
import { Match } from '../models/Match';
import { User, UserPayload } from '../models/User'
import { pubSub } from '../pubsub';
import { Chat } from '../models/Chat';
import { Dislike } from '../models/Dislike';

export const UserResolver = {
  Query: {
    healthCheck: async (): Promise<string> => "alive and kickin'",  
    allUsers: async () => {
      const users = await User.find();
      return users;
    },
    getUser: async (_, args: { userId: string }): Promise<User | undefined> => {
      return User.findOne({
        where: {
          id: args.userId
        }
      })
    },
  },
  Mutation: {
    createUser: async (_, args: Partial<UserPayload>): Promise<User | undefined> => {
      const user = Object.assign(new User(), {
        name: args.name,
        email: args.email,
        password: args.password,
        bio: args.bio,
        age: args.age,
        gender: args.gender
      })

      await user.save()

      return user;
    },
  },
  Subscription: {
    newMatch: {
      subscribe: (_, args) => pubSub.asyncIterator(`MATCH_${args.userId}`),
      resolve: (payload) => payload
    },
    newMessage: {
      subscribe: (_, args) => pubSub.asyncIterator(`MESSAGE_${args.userId}`),
      resolve: (payload) => {
        console.log("new message payload", payload)

        return payload;
      }
    },
    newMessageFromCurrentChat: {
      subscribe: (_, args) => pubSub.asyncIterator(`CHAT_MESSAGE_${args.chatId}`),
      resolve: (payload) => {
        console.log("new message payload", payload)

        return payload;
      }
    },
  },
  User: {
    allAvailableUsers: async (parent): Promise<User[]> => {
      // const users = await User.find();
      const users =
        await User.createQueryBuilder('user')
                  .leftJoin(Like, 'like', 'like.receiverId = user.id AND like.senderId = :myUserId', { myUserId: parent.id })
                  .leftJoin(Dislike, 'dislike', 'dislike.receiverId = user.id AND dislike.senderId = :myUserId', { myUserId: parent.id })
                  .leftJoin(Match, 'match1', 'match1.likedId = user.id AND match1.matchedId = :myUserId', { myUserId: parent.id })
                  .leftJoin(Match, 'match2', 'match2.matchedId = user.id AND match2.likedId = :myUserId', { myUserId: parent.id })
                  .where('like.senderId IS NULL')
                  .andWhere('dislike.senderId IS NULL')
                  .andWhere('match1.likedId IS NULL')
                  .andWhere('match2.matchedId IS NULL')
                  .andWhere('user.id != :myUserId', { myUserId: parent.id }) // Exclude yourself from the results
                  .getMany();

      return users
    },
    allMatchesLiked: async (parent): Promise<Match[]> => {
      return Match.find({
        where: [
          {
            likedId: parent.id,
            status: In(["new", "active"])
          },
        ],
        relations: ["matched"]
      })
    },
    allMatchesReceived: async (parent): Promise<Match[]> => {
      return Match.find({
        where: [
          {
            matchedId: parent.id,
            status: In(["new", "active"])
          },
        ],
        relations: ["liked"]
      })
    },
    allChats: async (parent): Promise<Chat[]> => {
      return Chat.find({
        where: [
          { starterId: parent.id },
          { receiverId: parent.id }
        ],
        relations: ["starter", "receiver"],
        order: { createdAt: "DESC" }
      })
    },
    allLikes: async (parent): Promise<Like[]> => {
      return Like.find({
        where: [
          { senderId: parent.id },
          { receiverId: parent.id },
        ],
        relations: ["sender", "receiver"]
      })
    },
    likesSent: async (parent): Promise<Like[]> => {
      return Like.find({
        where: {
          senderId: parent.id
        },
        relations: ["receiver"]
      })
    },
    likesReceived: async (parent): Promise<Like[]> => {
      return Like.find({
        where: {
          receiverId: parent.id
        },
        relations: ["sender"]
      })
    },
  }
};

// pubSub.publish(`MATCH_${userId}, {
//   newMatch: {
//     matchName: 'Ali Baba',
//     matchProfilePicture: 'Open sesame'
//   }
// });


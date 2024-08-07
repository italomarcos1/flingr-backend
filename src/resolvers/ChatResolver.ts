// @ts-nocheck
import { Chat } from "../models/Chat";
import { Match } from "../models/Match";
import { Message } from "../models/Message";

export const ChatResolver = {
  Query: {
    allChats: async (): Promise<Chat[]> => Chat.find(),
    getChat: async (_, args): Promise<Chat | undefined> => {
      return Chat.findOne({
        where: { id: args.chatId },
        relations: ["starter", "receiver"]
      })
    }
  },
  Mutation: {
    newChat: async (_, args): Promise<Chat> => {
      const { starterId, receiverId, matchId } = args;

      const chat = Object.assign(new Chat(), {
        starterId,
        receiverId,
        matchId
      })
  
      await chat.save();
  
      return chat;
    },
    deleteChat: async(_, args): Promise<boolean> => {
      await Promise.all([
        Chat.delete(args.chatId),
        Match.update(args.matchId, {
          status: "inactive"
        })
      ]);

      return true;
    },
  },
  Chat: {
    messages: async (parent): Promise<Message[]> => {
      return Message.find({
        where: { chatId: parent.id },
        relations: ["sender", "receiver"]
      })
    },
    lastMessage: async (parent): Promise<Message | undefined> => {
      return Message.findOne({
        where: { chatId: parent.id },
        order: {
          createdAt: "DESC"
        },
        relations: ["sender", "receiver"]
      })
    },
  }
}
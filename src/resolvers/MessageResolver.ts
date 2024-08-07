// @ts-nocheck
import { Message } from "../models/Message"
import { User } from "../models/User";
import { pubSub } from "../pubsub"

export const MessageResolver = {
  Query: {
    allMessages: async (_, args): Promise<Message[]> => {
      return Message.find({
        where: {
          chatId: args.chatId
        },
        relations: ["sender", "receiver"]
      })
    }
  },
  Mutation: {
    updateMessageToSeen: async (_, args): Promise<boolean> => {
      const [lastMessage] = await Message.find({
        where: {
          chatId: args.chatId
        },
        order: {
          createdAt: "DESC"
        },
        take: 1
      })

      await Message.update(lastMessage.id, {
        seen: true
      })

      return true;
    }, 
    sendMessage: async (_, args): Promise<Message> => {
      const { chatId, senderId, receiverId, content  } = args;
      const message = Object.assign(new Message(), {
        chatId,
        senderId,
        receiverId,
        content,
      })

      const { id } = await message.save()

      const senderData = await User.findOne({
        where: {
          id: senderId
        }
      })
  
      const messageData = {
        id,
        chatId,
        content,
        senderId: senderData?.id,
        senderName: senderData?.name,
        senderProfilePicture: senderData?.profilePicture
      }

      // chat → receiver? || { chatId, receiverId },
      pubSub.publish(`MESSAGE_${receiverId}`, messageData)
      pubSub.publish(`CHAT_MESSAGE_${chatId}`, messageData)
  
      return message
    } 
  }
}
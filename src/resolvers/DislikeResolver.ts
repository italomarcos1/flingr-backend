// @ts-nocheck
import { Dislike } from '../models/Dislike';

export const DislikeResolver = {
  Query: {
    allDislikes: async (): Promise<Dislike[]> => Dislike.find(),
  },
  Mutation: {
    sendDislike: async (_, args): Promise<Dislike> => {
      const { senderId, receiverId } = args
      
      const dislike = Object.assign(new Dislike(), {
        senderId,
        receiverId,
        createdAt: new Date().toISOString()
      })    
  
      await dislike.save()
  
      return dislike;
    },
  }
};



// @ts-nocheck
import { Like } from '../models/Like'
import { Match } from '../models/Match';
import { pubSub } from '../pubsub';

export const LikeResolver = {
  Query: {
    allLikes: async (): Promise<Like[]> => Like.find(),
  },
  Mutation: {
    sendLike: async (_, args): Promise<Like> => {
      const { senderId, receiverId } = args
      
      const like = Object.assign(new Like(), {
        senderId,
        receiverId,
        createdAt: new Date().toISOString()
      })
  
      const receiverAlsoLikedSender = await Like.findOne({
        where: {
          senderId: receiverId,
          receiverId: senderId
        },
        relations: ["sender", "receiver"]
      })
  
      if (!!receiverAlsoLikedSender) {
        const { sender, receiver } = receiverAlsoLikedSender
        
        const match = Object.assign(new Match(), {  
          likedId: receiverId,
          matchedId: senderId,
          status: "new"
        })
  
        const updatedMatch = await match.save();

        const senderMatchData = {
          id: updatedMatch.id,
          matchName: sender.name,
          matchProfilePicture: sender.profilePicture ?? "https://pbs.twimg.com/profile_images/479662854/FMF-00016_Revs_400x400.jpg",
          createdAt: String(updatedMatch.createdAt)
        }
        
        const receiverMatchData = {
          id: updatedMatch.id,
          matchName: receiver.name,
          matchProfilePicture: receiver.profilePicture ?? "https://pbs.twimg.com/profile_images/479662854/FMF-00016_Revs_400x400.jpg",
          createdAt: String(updatedMatch.createdAt)
        }
  
        pubSub.publish(`MATCH_${receiverId}`, receiverMatchData)
        pubSub.publish(`MATCH_${senderId}`, senderMatchData)

        await Like.delete(receiverAlsoLikedSender.id)

        return receiverAlsoLikedSender
      } else {
        await like.save()
  
        return like;
      }
    },
  }
};



// @ts-nocheck
import { Match } from "../models/Match"

export const MatchResolver = {
  Query: {
    lastMatch: async(_, args): Promise<Match | undefined> => {
      const lastMatch = await Match.find({
        where: {
          id: args.matchId
        },
        relations: ["liked", "matched"]
      })
      
      return lastMatch[0];
    }
  },
  Mutation: {
    updateMatch: async (_, args): Promise<boolean> => {
      console.log("args", args)
      await Match.update(args.matchId, {
        status: args.status
      });

      return true;
    },
    deleteMatch: async (_, args): Promise<boolean> => {
      await Match.delete(args.matchId)
      
      return true;
    }
  }
}
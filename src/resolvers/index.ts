import { mergeResolvers } from '@graphql-tools/merge';
import { UserResolver } from './UserResolver'
import { LikeResolver } from './LikeResolver';
import { DislikeResolver } from './DislikeResolver';
import { ChatResolver } from './ChatResolver';
import { MessageResolver } from './MessageResolver';
import { MatchResolver } from './MatchResolver';

export const resolvers = mergeResolvers([UserResolver, LikeResolver, DislikeResolver, ChatResolver, MessageResolver, MatchResolver]);
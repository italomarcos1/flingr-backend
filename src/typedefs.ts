export const typeDefs = `
  type Chat {
    id: ID!
    match: Match!
    messages: [Message!]!
    lastMessage: Message!
    receiver: User!
    receiverId: String!
    starter: User!
    starterId: String!
    matchId: String!
    createdAt: String!
  }

  type Like {
    createdAt: String!
    id: ID!
    receiver: User!
    receiverId: String!
    sender: User!
    senderId: String!
  }

  type Dislike {
    createdAt: String!
    id: ID!
    receiver: User!
    receiverId: String!
    sender: User!
    senderId: String!
  }

  type Match {
    chat: Chat!
    createdAt: String!
    id: ID!
    status: String!
    liked: User!
    likedId: String!
    matchName: String!
    matchProfilePicture: String!
    matched: User!
    matchedId: String!
  }

  type Message {
    chat: Chat!
    chatId: String!
    content: String!
    seen: Boolean!
    createdAt: String!
    id: ID!
    receiver: User!
    receiverId: String!
    sender: User!
    senderId: String!
  }

  type MessagePayload {
    id: ID!
    chatId: String!
    content: String!
    senderId: String!
    senderName: String!
    senderProfilePicture: String!
    receiverId: String!
    createdAt: String!
  }

  type Mutation {
    createUser(age: Float!, bio: String!, email: String!, gender: String!, name: String!, password: String!): User!
    updateMatch(matchId: String!, status: String!): Boolean
    deleteMatch(matchId: String!): Boolean
    deleteChat(chatId: String!, matchId: String!): Boolean
    newChat(receiverId: String!, starterId: String!, matchId: String!): Chat!
    sendLike(receiverId: String!, senderId: String!): Like!
    sendDislike(receiverId: String!, senderId: String!): Dislike!
    sendMessage(chatId: String!, content: String!, receiverId: String!, senderId: String!): Message!
    updateMessageToSeen(chatId: String!): Boolean!
  }

  type Query {
    allChats: [Chat!]!
    getChat(chatId: String!): Chat!
    allLikes: [Like!]!
    allDislikes: [Dislike!]!
    allMatches: [Match!]!
    allUsers: [User!]!
    allMessages(chatId: String!): [Message!]!
    getUser(userId: String!): User!
    lastMatch(matchId: String!): Match!
    healthCheck: String!
  }

  type Subscription {
    newMessage(userId: String!): MessagePayload!
    newMessageFromCurrentChat(chatId: String!): MessagePayload!
    newMatch(userId: String!): Match!
  }

  type User {
    age: Float!
    allChats: [Chat!]!
    allLikes: [Like!]!
    allAvailableUsers: [User!]!
    allMatchesLiked: [Match!]!
    allMatchesReceived: [Match!]!
    bio: String!
    chats: [Chat!]!
    email: String!
    gender: String!
    id: ID!
    likesReceived: [Like!]!
    likesSent: [Like!]!
    name: String!
    profilePicture: String!
    createdAt: String!
  }
`;
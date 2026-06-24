import { GraphQLID, GraphQLNonNull } from "graphql";

export const getUserProfileArgs = {userId: { type: new GraphQLNonNull(GraphQLID) }}
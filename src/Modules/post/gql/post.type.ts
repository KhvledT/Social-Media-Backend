import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const readPostType = new GraphQLObjectType({
    name: "readPostType",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        likes: {type: new GraphQLNonNull(new GraphQLList(GraphQLString))},
    }
})
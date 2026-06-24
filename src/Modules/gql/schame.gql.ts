import { GraphQLObjectType, GraphQLSchema } from "graphql";
import UserSchama from "../user/gql/user.schema.js";
import postSchema from "../post/gql/post.schema.js";

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name : "queryschema",
        fields : {
            ...UserSchama.userQueries()
         }
    }),
    mutation: new GraphQLObjectType({
        name : "mutationschema",
        fields : {
            ...postSchema.postMutation()
         }
    })
});

export default schema;
import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from "graphql";

export const reactPostArgs = {
  postId: { type: new GraphQLNonNull(GraphQLString) },
  react: {
    type: new GraphQLNonNull(
      new GraphQLEnumType({
        name: "reactType",
        values: {
          LIKE: { value: 0 },
          UNLIKE: { value: 1 },
        },
      }),
    ),
  },
};

import { ApolloServer } from 'apollo-server-lambda';
const jwt = require('jsonwebtoken');
const util = require('util');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema');

export const handler = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ event }) => {
    const token = event.headers.authorization
      ? event.headers.authorization.replace('Bearer ', '')
      : null;

    if (token) {
      const payload = await util.promisify(jwt.verify)(token, 'whateversecret');

      return { user: payload.user };
    }

    return null;
  },
  introspection: true,
  playground: true,
}).createHandler();
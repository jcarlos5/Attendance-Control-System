const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const { GET_USER_DATA } = require('./utils');
const { PrismaClient } = require('@prisma/client');

async function startApolloServer(typeDefs, resolvers) {
	const app = express();

	const httpServer = http.createServer(app);

	const prisma = new PrismaClient();

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
		context: ({ req, connection }) => {
			if (req) {
				if (req.get('Authorization')) {
					const USER_DATA = GET_USER_DATA(req.get('Authorization'));
					return { prisma, USER_DATA };
				} else {
					return { prisma, USER_DATA: {} };
				}
			} else {
				return connection.context;
			}
		},
	});

	await server.start();

	server.applyMiddleware({ app });

	await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

module.exports = {
	startApolloServer,
};

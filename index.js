const { startApolloServer } = require('./src/server');
const { getSchema } = require('./src/schema');

async function startServer() {
	const [typeDefs, resolvers] = await getSchema();
	startApolloServer(typeDefs, resolvers);
}

startServer();

const { DateTimeResolver } = require('graphql-scalars');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const localResolvers = require('./resolvers');

const getSchema = async () => {
	const typeDefs = await loadSchema('src/schema/schema.graphql', {
		loaders: [new GraphQLFileLoader()],
	});

	const resolvers = {
		DateTime: DateTimeResolver,
		...localResolvers.resolvers,
	};

	return [typeDefs, resolvers];
};

module.exports = {
	getSchema,
};

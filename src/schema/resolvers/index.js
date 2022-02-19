const User = require('./user');

const resolvers = {
	User: User.model,
	Query: {
		...User.queries,
	},
	Mutation: {
		...User.mutations,
	},
};

module.exports = {
	resolvers,
};

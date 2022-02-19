const { ERRORS } = require('../../utils');

const model = {
	author: async (parent, args, context) => {
		return await context.prisma.comment.findUnique({ where: { id: parent.id } }).author();
	},
	post: async (parent, args, context) => {
		return await context.prisma.comment.findUnique({ where: { id: parent.id } }).post();
	},
};

const queries = {
	listComments: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			if (args.post) {
				return await context.prisma.comment.findUnique({
					where: { id: { connect: { id: args.post } } },
				});
			}
			return await context.prisma.comment.findMany();
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
};

const mutations = {
	createComment: async (parent, args, context) => {
		if (context.USER_DATA.id) {
			const data = {
				content: args.content,
				author: { connect: { id: context.USER_DATA.id } },
			};
			return await context.prisma.comment.create({ data }).catch((err) => err);
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	updateComment: async (parent, args, context) => {
		if (context.USER_DATA.id) {
			const data = {content = args.content};
			return await context.prisma.comment
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	deleteComment: async (parent, args, context) => {
		const comment = await context.prisma.comment.findUnique({
			where: { id: args.id },
		});
		if (comment.author.id == context.USER_DATA.id) {
			return await context.prisma.comment
				.delete({ where: { id: parseInt(args.id) } })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
};

module.exports = {
	model,
	queries,
	mutations,
};

const { ERRORS } = require('../../utils');

const model = {
	author: async (parent, args, context) => {
		return await context.prisma.post.findUnique({ where: { id: parent.id } }).author();
	},
	comments: async (parent, args, context) => {
		return await context.prisma.post.findUnique({ where: { id: parent.id } }).comments();
	},
};

const queries = {
	getPost: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.post.findUnique({
				where: { id: args.id },
			});
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	listPosts: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.post.findMany();
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
};

const mutations = {
	createPost: async (parent, args, context) => {
		if (context.USER_DATA.id) {
			const data = {
				subject: args.subject,
				content: args.content,
				author: { connect: { id: context.USER_DATA.id } },
			};
			return await context.prisma.post.create({ data }).catch((err) => err);
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	updatePost: async (parent, args, context) => {
		if (context.USER_DATA.id) {
			const data = {};
			if (args.subject) data.subject = args.subject;
			if (args.content) data.content = args.content;
			return await context.prisma.post
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	deletePost: async (parent, args, context) => {
		role = context.USER_DATA.role;
		if (role == 'ADMIN' && args.id) {
			return await context.prisma.post
				.delete({ where: { id: parseInt(args.id) } })
				.catch((err) => err);
		} else {
			const post = await context.prisma.post.findUnique({
				where: { id: args.id },
			});
			if (post.author.id == context.USER_DATA.id) {
				return await context.prisma.post
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => err);
			} else {
				throw new Error(ERRORS.PERMISSIONS_ERROR);
			}
		}
	},
};

module.exports = {
	model,
	queries,
	mutations,
};

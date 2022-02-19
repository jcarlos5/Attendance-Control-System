const { ERRORS } = require('../../utils');

const model = {
	attendances: async (parent, args, context) => {
		return await context.prisma.session.findUnique({ where: { id: parent.id } }).attendances();
	},
};

const queries = {
	getSesssion: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.session.findUnique({
				where: { id: args.id },
			});
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	listSesssion: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.session.findMany();
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
};

const mutations = {
	createSession: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = { date: args.date };
			return await context.prisma.session.create({ data }).catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	updateSession: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = { date: args.date };
			return await context.prisma.session
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	deleteSession: async (parent, args, context) => {
		role = context.USER_DATA.role;
		if (role == 'ADMIN' && args.id) {
			return await context.prisma.session
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

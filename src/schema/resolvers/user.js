const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { SECRET_KEY, ERRORS } = require('../../utils');

const model = {
	attendances: async (parent, args, context) => {
		return await context.prisma.user.findUnique({ where: { id: parent.id } }).attendances();
	},
	attendanceLogs: async (parent, args, context) => {
		return await context.prisma.user.findUnique({ where: { id: parent.id } }).attendanceLogs();
	},
	posts: async (parent, args, context) => {
		return await context.prisma.user.findUnique({ where: { id: parent.id } }).posts();
	},
	comments: async (parent, args, context) => {
		return await context.prisma.user.findUnique({ where: { id: parent.id } }).comments();
	},
	ads: async (parent, args, context) => {
		return await context.prisma.user.findUnique({ where: { id: parent.id } }).ads();
	},
};

const queries = {
	login: async (parent, args, context, info) => {
		const user = await context.prisma.user.findUnique({
			where: { email: args.email },
		});
		if (user) {
			const success = await compare(args.password, user.password);
			if (success) {
				return sign({ id: user.id, role: user.role }, SECRET_KEY);
			} else {
				throw new Error(ERRORS.PASSWORD_ERROR);
			}
		} else {
			throw new Error(ERRORS.USERNAME_ERROR(args.userName));
		}
	},
	getUser: async (parent, args, context, info) => {
		if (!args.id) {
			if (context.USER_DATA.id) {
				return await context.prisma.user.findUnique({
					where: { id: context.USER_DATA.id },
				});
			} else {
				throw new Error(ERRORS.SESION_ERROR);
			}
		} else {
			role = context.USER_DATA.role;
			if (role == 'ADMIN') {
				return await context.prisma.user.findUnique({
					where: { id: args.id },
				});
			} else {
				throw new Error(ERRORS.PERMISSIONS_ERROR);
			}
		}
	},
	listUsers: async (parent, args, context, info) => {
		role = context.USER_DATA.role;
		if (role == 'ADMIN') {
			if (args.role) {
				return await context.prisma.user.findMany({
					where: { role: args.role },
				});
			} else {
				return await context.prisma.user.findMany();
			}
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
};

const mutations = {};

module.exports = {
	model,
	queries,
	mutations,
};

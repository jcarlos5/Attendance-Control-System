const { ERRORS } = require('../../utils');

const model = {
	session: async (parent, args, context) => {
		return await context.prisma.attendance.findUnique({ where: { id: parent.id } }).session();
	},
	logs: async (parent, args, context) => {
		return await context.prisma.attendance.findUnique({ where: { id: parent.id } }).logs();
	},
};

const queries = {};

const mutations = {
	createAttendance: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = {
				session: { connect: { id: args.session } },
				state: args.state,
				user: { connect: { id: args.user } },
			};
			return await context.prisma.attendance.create({ data }).catch((err) => err);
		} else {
			if (context.USER_DATA.id) {
				const data = {
					session: { connect: { id: args.session } },
					state: args.state,
					user: { connect: { id: context.USER_DATA.id } },
				};
				return await context.prisma.attendance.create({ data }).catch((err) => err);
			}
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	updateAttendance: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = { state: args.state };
			return await context.prisma.attendance
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	deleteAttendance: async (parent, args, context) => {
		role = context.USER_DATA.role;
		if (role == 'ADMIN' && args.id) {
			return await context.prisma.attendance
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

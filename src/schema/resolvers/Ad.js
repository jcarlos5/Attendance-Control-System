const { ERRORS } = require('../../utils');

const model = {
	author: async (parent, args, context) => {
		return await context.prisma.ad.findUnique({ where: { id: parent.id } }).author();
	},
};

const queries = {
	getAd: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.ad.findUnique({
				where: { id: args.id },
			});
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
	listAds: async (parent, args, context, info) => {
		if (context.USER_DATA.id) {
			return await context.prisma.ad.findMany();
		} else {
			throw new Error(ERRORS.SESION_ERROR);
		}
	},
};

const mutations = {
	createAd: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = {
				title: args.title,
				content: args.content,
				author: { connect: { id: context.USER_DATA.id } },
			};
			return await context.prisma.ad.create({ data }).catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	updateAd: async (parent, args, context) => {
		if (context.USER_DATA.role == 'ADMIN') {
			const data = {};
			if (args.title) data.subject = args.title;
			if (args.content) data.content = args.content;
			return await context.prisma.ad
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => err);
		} else {
			throw new Error(ERRORS.PERMISSIONS_ERROR);
		}
	},
	deleteAd: async (parent, args, context) => {
		role = context.USER_DATA.role;
		if (role == 'ADMIN' && args.id) {
			return await context.prisma.ad
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

export const useP = (fn) => async (req, res, next) => {
	try {
		await fn(req, res, next);
		res.locals.routeExist = true;
		next();
	} catch (error) {
		next(error);
	}
};

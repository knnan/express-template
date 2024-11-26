import externalRoutesV1 from "./v1/external-routes.js";
import internalRoutesV1 from "./v1/internal-routes.js";
import insecureRoutesV1 from "./v1/insecure-routes.js";

export const apiRouter = {
	v1: {
		externalRoutes: externalRoutesV1,
		internalRoutes: internalRoutesV1,
		insecureRoutes: insecureRoutesV1
	}
};

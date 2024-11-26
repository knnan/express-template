import { config } from "../configs/config.js";
import { isEmpty } from "../utils/empty.js";

const checkEnabledRoutes = ({ name }) => {
	if (isEmpty(name)) {
		throw new Error("Module name is empty");
	}
	return !config.app.disabledModules.includes(name);
};

export default checkEnabledRoutes;

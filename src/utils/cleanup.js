import { logger } from "../loggers/logger.js";

let sigintReceived = false;
process.on("SIGINT", (code) => {
	if (sigintReceived) {
		return;
	}
	sigintReceived = true;
	logger.info(`Process received ${code} signal, Emitting cleanup event as a response.\nPlease wait... `);
	process.emit("cleanup");
	setTimeout(() => {
		logger.info("Process will exit now.");
		process.exit(2);
	}, 3000);
});

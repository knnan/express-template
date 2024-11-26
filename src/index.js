import http from "node:http";
import { config } from "./configs/config.js";
import { logger } from "./loggers/logger.js";
import app from "./app.js";
import { initWsServer } from "./socketio.index.js";

/* Initialize http server */
const server = http.createServer(app);

/* Initialize socket.io server */
// initWsServer(server);

server.listen(config.app.port, () => {
	logger.info(`Server started at [http://127.0.0.1:${config.app.port}]`);
});

export default server;

import { Server as WsServer } from "socket.io";
import { logger } from "./loggers/logger.js";
// import logcollectorWsRoutes from "./modules/logcollector/logcollector.ws.routes.js";
import { socketInternalAuthenticate } from "./middlewares/auth.middleware.js";

// Mock l
const sockeRouteHandlers = {};

/**
 * @typedef {Object} wsManager
 * @property {import("socket.io").Server | null} wsServer Socket Server instance
 */

/** @type {wsManager} */
const wsManager = {
	wsServer: null
};

/**
 * @param {import("http").Server} server
 * @returns
 */

const initWsServer = async (server) => {
	try {
		const wsServer = new WsServer(server, {
			cors: {
				origin: "*"
			}
		});
		/*
		use below ex to connect on the client
		const socket = io.connect('http://localhost:3000', {
		auth: {
		token: "auth token"
		}
		});

		*/
		wsServer.use(socketInternalAuthenticate);

		const onConnHandler = (fn) => (socket) => {
			logger.info({ socketId: socket.id, isConnected: socket.connected }, "Socket Successfully Connected.");
			fn(socket);
		};
		wsServer.on("connection", onConnHandler(sockeRouteHandlers.registerEventHandlers));
		wsServer.on("connection_error", (err) => {
			logger.error(err);
			// process.exit(0);
		});
		wsManager.wsServer = wsServer;
	} catch (error) {
		logger.error(error);
		throw new Error("Failed to Initialize Socket.io server");
	}
};

export { initWsServer };

import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "express-template Api Documentation",
		version: "1.0.0",
		description: "This is a REST API application made with Express. This is the documentation for express-template ",
		license: {
			name: "Proprietary License",
			url: "https://www.sittingwater.com"
		},
		contact: {
			name: "sittingwater",
			url: "https://www.sittingwater.com"
		}
	}
};

const swaggerOptions = {
	swaggerDefinition: {
		...swaggerDefinition,
		servers: [
			{
				url: "http://localhost:5000/api/v1",
				description: "Local server"
			},
			{
				url: "{protocol}://{environment}.sittingwater.com/api/v1",
				variables: {
					protocol: {
						default: "https",
						enum: ["http", "https"]
					},
					environment: {
						default: "app",
						enum: ["app", "app-dev"]
					},
					version: {
						default: "v1",
						enum: ["v1", "v2"]
					}
				}
			}
		]
	},
	// Paths to files containing OpenAPI definitions
	apis: ["./swagger-docs/external/*.yaml"]
};
const swaggerOptionsInternal = {
	swaggerDefinition: {
		...swaggerDefinition,
		servers: [
			{
				url: "http://localhost:5000/api/internal/v1",
				description: "Local server"
			},
			{
				url: "{protocol}://{environment}.sittingwater.com/api/internal/v1",
				variables: {
					protocol: {
						default: "https",
						enum: ["http", "https"]
					},
					environment: {
						default: "node-stg",
						enum: ["node-stg", "device", "fork-pc", "artemesia-main", "artemesia-sub", "appium-dev"]
					},
					version: {
						default: "v1",
						enum: ["v1", "v2"]
					}
				}
			}
		]
	},
	// Paths to files containing OpenAPI definitions
	apis: ["./swagger-docs/internal/*.yaml"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
const swaggerSpecInternal = swaggerJSDoc(swaggerOptionsInternal);

export { swaggerSpec, swaggerSpecInternal, swaggerOptions, swaggerOptionsInternal };

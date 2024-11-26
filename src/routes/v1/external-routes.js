import express from "express";
import checkEnabledRoutes from "../checkEnabledRoutes.js";
import sampleRoutes from "../../modules/sample/v1/sample.routes.js";

const router = express.Router();

sampleRoutes.set(router, checkEnabledRoutes(sampleRoutes));

// same as below for other routese

export default router;

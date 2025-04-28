// src/middleware/index.ts
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { middleware as openApiValidator } from "express-openapi-validator";
import yaml from "yaml";
import fs from "fs";
import path from "path";
import { IError } from "../types/types";

/**
 * Sets up middleware for the Express application
 * @param {express.Express} app - The Express application instance
 * @returns {void} No return value
 * @description Configures CORS, JSON parsing, Swagger documentation, OpenAPI validation,
 *              and error handling middleware for the application.
 *              - Sets up CORS with credentials for localhost:3000
 *              - Enables JSON request body parsing
 *              - Serves Swagger UI documentation at /api-docs
 *              - Validates requests and responses against OpenAPI spec
 *              - Adds global error handling middleware
 */
export const setupMiddleware = (app: express.Express): void => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
  
  app.set("trust proxy", 1);
  
  app.use(
    cors({
      credentials: true,
      origin: CLIENT_URL,
    })
  );

  app.use(express.json());

  const openApiPath = path.join(__dirname, "../openapi.yaml");
  const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, "utf8"));

  const swaggerOptions = {
    customSiteTitle: "Fake Stack Overflow API Documentation",
    customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }',
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: "none",
      showCommonExtensions: true,
    },
  };
  
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerOptions));

  app.use(
    openApiValidator({
      apiSpec: openApiPath,
      validateRequests: true,
      validateResponses: true,
      formats: {
        "mongodb-id": /^[0-9a-fA-F]{24}$/,
      },
    })
  );

  /**
   * Global error handling middleware
   * @param {IError} err - Error object containing status and error details
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next middleware function
   * @returns {void} No return value
   * @description Handles errors that occur during request processing:
   *              - If headers already sent, passes to next error handler
   *              - For rate limit errors, returns 429 status code
   *              - For validation errors, returns status code and error details
   *              - For other errors, returns 500 with error message
   */
  app.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    
    // ✅ Explicitly pass through express-rate-limit errors
    if (err.status === 429 || err.statusCode === 429) {
      return res.status(429).json({
        message: err.message || "Too many requests",
      });
    }
    
    if (err && err.status && err.errors) {
      return res.status(err.status).json({
        message: err.message,
        errors: err.errors,
      });
    } else {
      return res.status(500).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
      });
    }
  });
};

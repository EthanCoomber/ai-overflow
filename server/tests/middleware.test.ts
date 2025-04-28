// tests/middleware.test.ts
import express from "express";
import request from "supertest";
import { setupMiddleware } from "../middleware";
import { IError } from "../types/types";

describe("Middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    // Test routes to simulate various error scenarios
    app.get("/test-rate-limit", (req, res, next) => {
      const err = new Error("Too many requests");
      const customErr: IError = {
        status: 429,
        statusCode: 429,
        message: err.message,
        errors: []
      };
      next(customErr);
    });

    app.get("/test-rate-limit-statuscode", (req, res, next) => {
      const err = new Error("Too many requests");
      const customErr: IError = {
        status: 0,
        statusCode: 429,
        message: err.message,
        errors: []
      };
      next(customErr);
    });

    app.get("/test-validation", (req, res, next) => {
      const err = new Error("Validation error");
      const customErr: IError = {
        status: 400,
        statusCode: 400,
        message: err.message,
        errors: ["field is required"]
      };
      next(customErr);
    });

    app.get("/test-generic-error", (req, res, next) => {
      next(new Error("Something went wrong"));
    });

    app.get("/test-non-error", (req, res, next) => {
      next("string error");
    });

    app.get("/test-headers-sent", (req, res, next) => {
      res.status(200).send("OK");
      const err = new Error("Headers already sent");
      next(err);
    });

    // Attach global middleware
    setupMiddleware(app);
  });

  it("should handle rate limit errors (429)", async () => {
    const response = await request(app).get("/test-rate-limit");
    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: "Too many requests",
    });
  });

  it("should handle rate limit errors with statusCode property", async () => {
    const response = await request(app).get("/test-rate-limit-statuscode");
    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: "Too many requests",
    });
  });

  it("should handle validation errors", async () => {
    const response = await request(app).get("/test-validation");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Validation error",
      errors: ["field is required"],
    });
  });

  it("should handle generic errors", async () => {
    const response = await request(app).get("/test-generic-error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Something went wrong",
    });
  });

  it("should handle non-Error objects", async () => {
    const response = await request(app).get("/test-non-error");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
    });
  });

  it("should pass to next if headers already sent", async () => {
    const response = await request(app).get("/test-headers-sent");
    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
  });
});

// middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many AI requests from this IP, please try again after a minute.",
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many AI requests from this IP, please try again after a minute.",
    });
  },
});

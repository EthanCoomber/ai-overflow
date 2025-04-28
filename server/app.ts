import express from "express";
import routes from "./routes/index";
import { setupMiddleware } from "./middleware";

const app = express();
setupMiddleware(app);
app.use("/", routes);

export default app;

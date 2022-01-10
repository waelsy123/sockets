import Express from "express";
import { Request, Response, NextFunction } from "express";
import routes from "./routes";

function handleNotFound(req: Request, res: Response, next: NextFunction): void {
  console.log("route not found");
  res.status(404);
  res.send(`Route not found for: ${req.path}`);
  return next();
}

function handleError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  return res.status(500).json(err.message);
}

const app = Express();

app.use(Express.json());

// Route handlers
app.use(routes);

// Catch 404 and forward to error handler
app.use(handleNotFound);

// Error handler
app.use(handleError);

export default app;

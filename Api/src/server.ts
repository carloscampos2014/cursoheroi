import express, { Application, NextFunction, Request, Response } from "express";
import multer from "multer";
import { upload } from "./config/multer";
import { UsersRoutes } from "./routes/users.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = new UsersRoutes().getRoutes();

app.use("/users", userRoutes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      console.log(err.message);
      return response.status(400).json({
        message: err.message,
      });
    }

    console.log("Internal Server Error");
    return response.status(500).json({
      message: "Internal Server Error",
    });
  }
);

app.listen(3000, () =>
  console.log("Server is running -> http://localhost:3000/")
);

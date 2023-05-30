import { Router } from "express";
import { upload } from "../config/multer";
import { UsersController } from "../controllers/UsersController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
class UsersRoutes {
  private router: Router;
  private usersController: UsersController;
  private authMiddleware: AuthMiddleware;
  constructor() {
    this.router = Router();
    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();
  }
  getRoutes() {
    this.router.get("/", this.usersController.index.bind(this.usersController));
    this.router.post(
      "/",
      this.usersController.store.bind(this.usersController)
    );
    this.router.post(
      "/auth",
      this.usersController.auth.bind(this.usersController)
    );
    this.router.put(
      "/",
      this.authMiddleware.auth,
      upload.single("avatar_url"),
      this.usersController.update.bind(this.usersController)
    );
    return this.router;
  }
}

export { UsersRoutes };

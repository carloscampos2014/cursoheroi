import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayLoad {
  sub: string;
}

class AuthMiddleware {
  async auth(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({
        code: "token.missing",
        message: "Token missing",
      });
    }

    const [, token] = authHeader.split(" ");
    try {
      let secretKey: string | undefined = process.env.JWT_TOKEN;
      if (!secretKey) {
        throw new Error("JWT Access key invalid");
      }

      const { sub } = verify(token, secretKey) as IPayLoad;
      request.user_id = sub;
      return next();
    } catch (error) {
      return response.status(401).json({
        code: "token.expired",
        message: "Token expired",
      });
    }
  }
}

export { AuthMiddleware };

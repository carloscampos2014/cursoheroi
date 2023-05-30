import { NextFunction, Request, Response } from "express";
import { UsersServices } from "../services/UsersServices";
class UsersController {
  private usersService: UsersServices;
  constructor() {
    this.usersService = new UsersServices();
  }

  index(request: Request, response: Response, next: NextFunction) {
    //listar users
    console.log("Entrou aqui");
    return response.status(200).json({
      message: "Teste de Rota GET",
    });
  }
  show() {
    //Mostrar um item
  }
  async store(request: Request, response: Response, next: NextFunction) {
    //Criação um item
    try {
      const { name, email, password } = request.body;
      const result = await this.usersService.create({ name, email, password });

      return response.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
  async update(request: Request, response: Response, next: NextFunction) {
    //Criação um item
    try {
      const { name, newPassword, oldPassword } = request.body;
      const user_id = request.user_id;
      const result = await this.usersService.update({
        user_id,
        name,
        newPassword,
        oldPassword,
        avatar_url: request.file,
      });
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    //Autenticação
    try {
      const { email, password } = request.body;
      const result = await this.usersService.auth(email, password);
      return response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { UsersController };

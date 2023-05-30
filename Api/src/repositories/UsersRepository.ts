import { prisma } from "../database/prisma";
import { ICreate } from "../interfaces/UsersInterfaces";

class UsersRepository {
  async create({ name, email, password }: ICreate) {
    const result = await prisma.users.create({
      data: {
        name,
        email,
        password,
        avatar_url: "",
      },
    });

    return result;
  }

  async update(
    name: string,
    password: string,
    avatar_url: string,
    user_id: string
  ) {
    const result = await prisma.users.update({
      where: {
        id: user_id,
      },
      data: {
        name,
        password,
        avatar_url,
      },
    });

    return result;
  }

  async findUserById(id: string) {
    const result = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  async findUserByEmail(email: string) {
    const result = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    return result;
  }
}

export { UsersRepository };

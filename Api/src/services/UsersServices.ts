import { compare, hash } from "bcrypt";
import { s3 } from "../config/aws";
import { v4 as uuid } from "uuid";
import { ICreate, IUpdate } from "../interfaces/UsersInterfaces";
import { UsersRepository } from "../repositories/UsersRepository";
import { sign } from "jsonwebtoken";

class UsersServices {
  private userRepository: UsersRepository;
  constructor() {
    this.userRepository = new UsersRepository();
  }

  async create({ name, email, password }: ICreate) {
    const findUser = await this.userRepository.findUserByEmail(email);
    if (findUser) {
      throw new Error("User exists");
    }

    const hashPassword = await hash(password, 10);

    const create = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return create;
  }

  async auth(email: string, password: string) {
    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) {
      throw new Error("User or password is invalid");
    }

    const passwordMatch = await compare(password, findUser.password);
    if (!passwordMatch) {
      throw new Error("User or password is invalid");
    }

    let secretKey: string | undefined = process.env.JWT_TOKEN;
    if (!secretKey) {
      throw new Error("JWT Access key invalid");
    }

    const token = sign({ email }, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 15,
    });

    return {
      token,
      user: {
        name: findUser.name,
        email: findUser.email,
      },
    };
  }

  async update({
    user_id,
    name,
    newPassword,
    oldPassword,
    avatar_url,
  }: IUpdate) {
    const findUser = await this.userRepository.findUserById(user_id);
    if (!findUser) {
      throw new Error("User not exists");
    }

    let password: string = findUser.password;
    let avatarLocation: string = findUser.avatar_url;

    if (oldPassword && newPassword) {
      const passwordMatch = await compare(oldPassword, findUser.password);
      if (!passwordMatch) {
        throw new Error("Password is invalid");
      }
      password = await hash(newPassword, 10);
    }

    if (avatar_url) {
      const uploadImage = avatar_url?.buffer;
      const uploadS3 = await s3
        .upload({
          Bucket: "carlos-semana-heroi",
          Key: `${uuid()}-${avatar_url?.originalname}`,
          Body: uploadImage,
        })
        .promise();
      avatarLocation = uploadS3.Location;
    }

    const update = await this.userRepository.update(
      name,
      password,
      avatarLocation,
      user_id
    );

    return update;
  }
}

export { UsersServices };

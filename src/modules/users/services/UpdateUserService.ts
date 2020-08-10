import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import User from "../infra/typeorm/entities/User";

import IUsersRepository from "../repositories/IUsersRepository";

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ user_id, name, email }: Request): Promise<void> {}
}

export default UpdateUserService;

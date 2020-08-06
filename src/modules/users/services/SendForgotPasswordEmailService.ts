import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
// import User from "../infra/typeorm/entities/User";

import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUsersRepository from "../repositories/IUsersRepository";

import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface Request {
  email: string;
  body: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("MailProvider")
    private mailProvider: IMailProvider,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository
  ) {}

  public async execute({ email, body }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists.");
    }

    const userToken = await this.userTokensRepository.generate(user.id);

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha: ${userToken.token}`
    );
  }
}
export default SendForgotPasswordEmailService;

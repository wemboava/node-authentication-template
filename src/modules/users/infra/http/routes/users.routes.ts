import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";

import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();
  const createUserService = new CreateUserService(usersRepository);

  const user = await createUserService.execute({ name, email, password });

  return response.status(200).json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const UpdateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await UpdateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.status(200).json(user);
  }
);

export default usersRouter;

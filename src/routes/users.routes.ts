import { Router } from "express";
import multer from "multer";

import uploadConfig from "../config/upload";

import CreateUserService from "../services/CreateUserService";
import UpdateUserAvatarService from "../services/UpdateUserAvatarService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return response.status(200).json(user);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    try {
      const UpdateUserAvatar = new UpdateUserAvatarService();

      const user = await UpdateUserAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      return response.status(200).json(user);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }
);

export default usersRouter;

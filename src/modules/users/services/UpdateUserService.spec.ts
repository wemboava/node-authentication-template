import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";

let fakeAUsersRepository: FakeAUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe("UpdateUserAvatar", () => {
  beforeEach(() => {
    fakeAUsersRepository = new FakeAUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeAUsersRepository,
      fakeStorageProvider
    );
  });

  it("should be able to update avatar", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "image-name",
    });

    expect(user.avatar).toBe("image-name");
  });

  it("should delete old avatar when updating new one", async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: "non-existing-user",
        avatarFileName: "image-name",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update avatar", async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "old-avatar.png",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: "new-avatar.png",
    });

    expect(deleteFile).toHaveBeenCalledWith("old-avatar.png");

    expect(user.avatar).toBe("new-avatar.png");
  });
});

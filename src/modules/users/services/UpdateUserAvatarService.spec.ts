import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";

describe("UpdateUserAvatar", () => {
  it("should be able to update avatar", async () => {
    const fakeAUsersRepository = new FakeAUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeAUsersRepository,
      fakeStorageProvider
    );

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
    const fakeAUsersRepository = new FakeAUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeAUsersRepository,
      fakeStorageProvider
    );

    expect(
      updateUserAvatar.execute({
        user_id: "non-existing-user",
        avatarFileName: "image-name",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update avatar", async () => {
    const fakeAUsersRepository = new FakeAUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeAUsersRepository,
      fakeStorageProvider
    );

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

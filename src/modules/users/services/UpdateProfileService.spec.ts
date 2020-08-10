import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfile from "./UpdateProfileService";

import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";

let fakeAUsersRepository: FakeAUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfile;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeAUsersRepository = new FakeAUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfile(fakeAUsersRepository, fakeHashProvider);
  });

  it("should be able to update user profile", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Willian updated",
      email: "w.emboava.o@updated.com",
    });

    expect(updatedUser.name).toBe("Willian updated");
    expect(updatedUser.email).toBe("w.emboava.o@updated.com");
  });

  it("should not be able to change the another user email", async () => {
    await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    const user = await fakeAUsersRepository.create({
      name: "user test",
      email: "test@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "user test updated",
        email: "w.emboava.o@gmail.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Willian updated",
      email: "w.emboava.o@updated.com",
      old_password: "123456",
      password: "654321",
    });

    expect(updatedUser.password).toBe("654321");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Willian updated",
        email: "w.emboava.o@updated.com",
        password: "654321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Willian updated",
        email: "w.emboava.o@updated.com",
        old_password: "wrong-old-password",
        password: "654321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the profile from non-existing user", async () => {
    await expect(
      updateProfile.execute({
        user_id: "user-wrong",
        name: "Willian updated",
        email: "w.emboava.o@updated.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

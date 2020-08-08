import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import CreateUserService from "./CreateUserService";

import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeAUsersRepository: FakeAUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeAUsersRepository = new FakeAUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeAUsersRepository, fakeHashProvider);
  });

  it("should be able to create a new user", async () => {
    fakeAUsersRepository = new FakeAUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeAUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email from another", async () => {
    await createUser.execute({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    await expect(
      createUser.execute({
        name: "Willian Emboava",
        email: "w.emboava.o@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

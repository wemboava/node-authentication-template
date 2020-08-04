import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import CreateUserService from "./CreateUserService";
import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";

describe("CreateAppointment", () => {
  it("should be able to create a new user", async () => {
    const fakeAUsersRepository = new FakeAUsersRepository();
    const createUser = new CreateUserService(fakeAUsersRepository);

    const user = await createUser.execute({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with same email from another", async () => {
    const fakeAUsersRepository = new FakeAUsersRepository();
    const createUser = new CreateUserService(fakeAUsersRepository);

    await createUser.execute({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    expect(
      createUser.execute({
        name: "Willian Emboava",
        email: "w.emboava.o@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

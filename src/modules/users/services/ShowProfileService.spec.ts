import "reflect-metadata";
import AppError from "@shared/errors/AppError";

import ShowProfile from "./ShowProfileService";

import FakeAUsersRepository from "../repositories/fakes/FakeUsersRepository";

let fakeAUsersRepository: FakeAUsersRepository;
let showProfile: ShowProfile;

describe("ShowProfile", () => {
  beforeEach(() => {
    fakeAUsersRepository = new FakeAUsersRepository();

    showProfile = new ShowProfile(fakeAUsersRepository);
  });

  it("should be able to show the profile", async () => {
    const user = await fakeAUsersRepository.create({
      name: "Willian Emboava",
      email: "w.emboava.o@gmail.com",
      password: "123456",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe("Willian Emboava");
    expect(profile.email).toBe("w.emboava.o@gmail.com");
  });

  it("should not be able to show the profile from non-existing user", async () => {
    await expect(
      showProfile.execute({ user_id: "user-wrong" })
    ).rejects.toBeInstanceOf(AppError);
  });
});

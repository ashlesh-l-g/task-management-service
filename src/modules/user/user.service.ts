import { UserAlreadyExistsError, UserNotFoundError } from "./user.errors";
import { IUserRepository } from "./user.repository";
import { User } from "./user.types";
import { hashPassword, comparePassword } from "../../shared/utils/password";
import { generateToken } from "../../shared/utils/jwt";

export interface IUserService {
  registerUser(email: string, password: string): Promise<User>;
  loginUser(email: string, password: string): Promise<{ token: string }>;
  getUserById(id: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async registerUser(email: string, password: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);

    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const hashed = await hashPassword(password);

    return this.userRepo.create({
      email,
      password: hashed
    });
  }

  async loginUser(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);

    return { token };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.userRepo.softDelete(id);
  }
}
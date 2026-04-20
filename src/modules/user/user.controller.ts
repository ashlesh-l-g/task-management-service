import { Request, Response } from 'express';
import { IUserService } from './user.service';

export class UserController {
  constructor(private readonly userService: IUserService) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await this.userService.registerUser(email, password);

    res.status(201).json(user);
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await this.userService.loginUser(email, password);

    res.status(200).json(result);
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const user = await this.userService.getUserById(id);

    res.status(200).json(user);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    await this.userService.deleteUser(id);

    res.status(204).send();
  }
}
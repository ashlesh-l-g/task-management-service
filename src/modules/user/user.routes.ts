import { Router } from 'express';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const router: Router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', (req, res) => userController.registerUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));

router.get('/:id', (req, res) => userController.getUserById(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;
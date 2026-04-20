import { User } from './user.types';
import { prisma } from '../../shared/database/prisma';

export interface IUserRepository {
    create(data: { email: string; password: string }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    softDelete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository{
    
    async create(data: { email: string; password: string }): Promise<User>{
        const created = await prisma.user.create({
            data: { 
                email: data.email,
                password: data.password
            }
        });

        return {
            id: created.id,
            email: created.email,
            password: created.password,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
            deletedAt: created.deletedAt
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const found = await prisma.user.findFirst({
            where: {
                email,
                deletedAt: null
            }
        });
        if (!found) return null;

        return{
            id: found.id,
            email: found.email,
            password: found.password,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt,
            deletedAt: found.deletedAt
        };
    }

    async findById(id: string): Promise<User | null> {
        const found = await prisma.user.findFirst({
            where:{
                id,
                deletedAt: null
            }
        });
        
        if (!found) return null;

        return{
            id: found.id,
            email: found.email,
            password: found.password,
            createdAt: found.createdAt,
            updatedAt: found.updatedAt,
            deletedAt: found.deletedAt
        };
    }

    async softDelete(id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });
    }
}

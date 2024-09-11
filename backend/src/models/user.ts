import { prismaClient } from '../database'
import { User } from '@prisma/client';


export class UserStore {
    async index(): Promise<User[]> {
        try {
            const allUsers = await prismaClient.user.findMany();
            if (!allUsers) {
                throw Error('No users found in the database');
            }
            return allUsers;
        } catch (error: unknown) {
            console.error("Error fetching users:", error);
            throw new Error('Failed to fetch users. Please try again later.');
        } finally {
            await prismaClient.$disconnect();
        }
    }

    async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        try {
            const newUser = await prismaClient.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    name: user.name,  
                },
            });
            return newUser;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to create user: ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    async show(userId: number): Promise<User> {
        try {
            const user = await prismaClient.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            return user;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to retrieve user (${userId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    async update(userId: number, data: Partial<User>): Promise<User> {
        try {
            const updatedUser = await prismaClient.user.update({
                where: { id: userId },
                data: {
                    username: data.username,
                    email: data.email,
                    name: data.name,  
                },
            });
            return updatedUser;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to update user (${userId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    async delete(userId: number): Promise<User> {
        try {
            // Delete the user and return the deleted record
            const deletedUser = await prismaClient.user.delete({
                where: { id: userId },
            });

            return deletedUser;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to delete user (${userId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }
    
}
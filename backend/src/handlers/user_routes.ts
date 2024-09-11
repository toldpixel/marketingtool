import express, { Request, Response } from 'express';
import { User } from '@prisma/client' 
import { UserStore } from '../models/user';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user: Omit<User, 'id' | 'createdAt'> = {
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
        };
        const newUser = await store.create(user);
        res.status(201).json(newUser);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

const show = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const user = await store.show(id); // Fetch a user by ID
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const user: Partial<User> = {
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
        };
        const updatedUser = await store.update(id, user); // Update user by ID
        res.json(updatedUser);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = await store.delete(id); // Delete user by ID
        res.json(deletedUser);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

const userRoutes = (app: express.Application) => {
    app.get('/api/users', index);      // Get all users
    app.post('/api/users', create);    // Create a new user
    app.get('/api/users/:id', show);   // Get a single user by ID
    app.put('/api/users/:id', update); // Update a user by ID
    app.delete('/api/users/:id', destroy); // Delete a user by ID
};

export default userRoutes;

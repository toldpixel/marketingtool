import express, { Request, Response } from 'express';
import { Profile } from '@prisma/client'; // Import Profile type from Prisma
import { ProfileStore } from '../models/profile'; // Adjust the path to match your project structure

const store = new ProfileStore();

// Index route: Get all profiles
const index = async (_req: Request, res: Response) => {
    try {
        const profiles = await store.index(); // Fetch all profiles from ProfileStore
        res.json(profiles);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Create route: Create a new profile
const create = async (req: Request, res: Response) => {
    try {
        const profile: Omit<Profile, 'id'> = {
            bio: req.body.bio,
            userId: req.body.userId,  // Ensure the user ID is valid and exists
        };
        const newProfile = await store.create(profile);
        res.status(201).json(newProfile);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Show route: Get a single profile by ID
const show = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const profile = await store.show(id); // Fetch a profile by ID
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Update route: Update a profile by ID
const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const profile: Partial<Profile> = {
            bio: req.body.bio,
        };
        const updatedProfile = await store.update(id, profile); // Update profile by ID
        res.json(updatedProfile);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Delete route: Delete a profile by ID
const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deletedProfile = await store.delete(id); // Delete profile by ID
        res.json(deletedProfile);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Function to configure the routes
const profileRoutes = (app: express.Application) => {
    app.get('/api/profiles', index);      // Get all profiles
    app.post('/api/profiles', create);    // Create a new profile
    app.get('/api/profiles/:id', show);   // Get a single profile by ID
    app.put('/api/profiles/:id', update); // Update a profile by ID
    app.delete('/api/profiles/:id', destroy); // Delete a profile by ID
};

export default profileRoutes;

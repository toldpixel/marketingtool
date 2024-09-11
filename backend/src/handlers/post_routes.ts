import express, { Request, Response } from 'express';
import { Post } from '@prisma/client'; // Import Post type from Prisma Client
import { PostStore } from '../models/post'; // Adjust the path as necessary

const store = new PostStore();

// Index route: Get all posts
const index = async (_req: Request, res: Response) => {
    try {
        const posts = await store.index(); // Fetch all posts from PostStore
        res.json(posts);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Create route: Create a new post
const create = async (req: Request, res: Response) => {
    try {
        const post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published ?? false,
            authorId: req.body.authorId, // Ensure this is a valid user ID
        };
        const newPost = await store.create(post);
        res.status(201).json(newPost);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Show route: Get a single post by ID
const show = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const post = await store.show(id); // Fetch a post by ID
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Update route: Update a post by ID
const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const post: Partial<Post> = {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
        };
        const updatedPost = await store.update(id, post); // Update post by ID
        res.json(updatedPost);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Delete route: Delete a post by ID
const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deletedPost = await store.delete(id); // Delete post by ID
        res.json(deletedPost);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Function to configure the routes
const postRoutes = (app: express.Application) => {
    app.get('/api/posts', index);      // Get all posts
    app.post('/api/posts', create);    // Create a new post
    app.get('/api/posts/:id', show);   // Get a single post by ID
    app.put('/api/posts/:id', update); // Update a post by ID
    app.delete('/api/posts/:id', destroy); // Delete a post by ID
};

export default postRoutes;

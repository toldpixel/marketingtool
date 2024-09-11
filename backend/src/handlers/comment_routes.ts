import express, { Request, Response } from 'express';
import { Comment } from '@prisma/client'; // Import the Comment type from Prisma
import { CommentStore } from '../models/comment'; // Adjust the path as necessary

const store = new CommentStore();

// Index route: Get all comments
const index = async (_req: Request, res: Response) => {
    try {
        const comments = await store.index(); // Fetch all comments from CommentStore
        res.json(comments);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Create route: Create a new comment
const create = async (req: Request, res: Response) => {
    try {
        const comment: Omit<Comment, 'id' | 'createdAt'> = {
            content: req.body.content,
            authorId: req.body.authorId,  // Ensure this is a valid user ID
            postId: req.body.postId,      // Ensure this is a valid post ID
        };
        const newComment = await store.create(comment);
        res.status(201).json(newComment);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Show route: Get a single comment by ID
const show = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const comment = await store.show(id); // Fetch a comment by ID
        if (comment) {
            res.json(comment);
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Update route: Update a comment by ID
const update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const comment: Partial<Comment> = {
            content: req.body.content,
        };
        const updatedComment = await store.update(id, comment); // Update comment by ID
        res.json(updatedComment);
    } catch (err) {
        const error = err as Error;
        res.status(400).json({ error: error.message });
    }
};

// Delete route: Delete a comment by ID
const destroy = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const deletedComment = await store.delete(id); // Delete comment by ID
        res.json(deletedComment);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ error: error.message });
    }
};

// Function to configure the routes
const commentRoutes = (app: express.Application) => {
    app.get('/api/comments', index);      // Get all comments
    app.post('/api/comments', create);    // Create a new comment
    app.get('/api/comments/:id', show);   // Get a single comment by ID
    app.put('/api/comments/:id', update); // Update a comment by ID
    app.delete('/api/comments/:id', destroy); // Delete a comment by ID
};

export default commentRoutes;

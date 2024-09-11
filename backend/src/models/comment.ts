import { prismaClient } from '../database';
import { Comment } from '@prisma/client';

export class CommentStore {
    // Fetch all comments
    async index(): Promise<Comment[]> {
        try {
            const allComments = await prismaClient.comment.findMany();
            if (!allComments) {
                throw Error('No comments found in the database');
            }
            return allComments;
        } catch (error: unknown) {
            console.error("Error fetching comments:", error);
            throw new Error('Failed to fetch comments. Please try again later.');
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Create a new comment
    async create(commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
        try {
            const newComment = await prismaClient.comment.create({
                data: {
                    content: commentData.content,
                    authorId: commentData.authorId,  // Link to the user who created the comment
                    postId: commentData.postId,      // Link to the post on which the comment was made
                },
            });
            return newComment;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to create comment: ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Fetch a single comment by ID
    async show(commentId: number): Promise<Comment> {
        try {
            const comment = await prismaClient.comment.findUnique({
                where: {
                    id: commentId,
                },
            });

            if (!comment) {
                throw new Error(`Comment with ID ${commentId} not found`);
            }

            return comment;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to retrieve comment (${commentId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Update a comment by ID
    async update(commentId: number, data: Partial<Comment>): Promise<Comment> {
        try {
            const updatedComment = await prismaClient.comment.update({
                where: { id: commentId },
                data: {
                    content: data.content,
                },
            });
            return updatedComment;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to update comment (${commentId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Delete a comment by ID
    async delete(commentId: number): Promise<Comment> {
        try {
            const deletedComment = await prismaClient.comment.delete({
                where: { id: commentId },
            });
            return deletedComment;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to delete comment (${commentId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }
}

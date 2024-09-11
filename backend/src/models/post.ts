import { prismaClient } from '../database';
import { Post, Prisma } from '@prisma/client';

export class PostStore {
    // Fetch all posts
    async index(): Promise<Post[]> {
        try {
            const allPosts = await prismaClient.post.findMany();
            if (!allPosts.length) {
                throw new Error('No posts found in the database');
            }
            return allPosts;
        } catch (error: unknown) {
            console.error("Error fetching posts:", error);
            throw new Error('Failed to fetch posts. Please try again later.');
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Create a new post
    async create(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
        try {
            const newPost = await prismaClient.post.create({
                data: {
                    title: postData.title,
                    content: postData.content,
                    published: postData.published,
                    authorId: postData.authorId,  // Ensure the author exists in the user table
                },
            });
            return newPost;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to create post: ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Fetch a single post by ID
    async show(postId: number): Promise<Post> {
        try {
            const post = await prismaClient.post.findUnique({
                where: {
                    id: postId,
                },
            });

            if (!post) {
                throw new Error(`Post with ID ${postId} not found`);
            }

            return post;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to retrieve post (${postId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Update a post by ID
    async update(postId: number, data: Partial<Post>): Promise<Post> {
        try {
            const updatedPost = await prismaClient.post.update({
                where: { id: postId },
                data: {
                    title: data.title,
                    content: data.content,
                    published: data.published,
                },
            });
            return updatedPost;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to update post (${postId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Delete a post by ID
    async delete(postId: number): Promise<Post> {
        try {
            const deletedPost = await prismaClient.post.delete({
                where: { id: postId },
            });
            return deletedPost;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to delete post (${postId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }
}

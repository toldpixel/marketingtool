import { prismaClient } from '../database';
import { Profile } from '@prisma/client'; // Import the Profile type from Prisma

export class ProfileStore {
    // Fetch all profiles
    async index(): Promise<Profile[]> {
        try {
            const allProfiles = await prismaClient.profile.findMany();
            if (!allProfiles.length) {
                throw new Error('No profiles found in the database');
            }
            return allProfiles;
        } catch (error: unknown) {
            console.error("Error fetching profiles:", error);
            throw new Error('Failed to fetch profiles. Please try again later.');
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Create a new profile
    async create(profileData: Omit<Profile, 'id'>): Promise<Profile> {
        try {
            const newProfile = await prismaClient.profile.create({
                data: {
                    bio: profileData.bio,
                    userId: profileData.userId,  // Ensure this is a valid user ID
                },
            });
            return newProfile;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to create profile: ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Fetch a single profile by ID
    async show(profileId: number): Promise<Profile> {
        try {
            const profile = await prismaClient.profile.findUnique({
                where: {
                    id: profileId,
                },
            });

            if (!profile) {
                throw new Error(`Profile with ID ${profileId} not found`);
            }

            return profile;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to retrieve profile (${profileId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Update a profile by ID
    async update(profileId: number, data: Partial<Profile>): Promise<Profile> {
        try {
            const updatedProfile = await prismaClient.profile.update({
                where: { id: profileId },
                data: {
                    bio: data.bio,
                },
            });
            return updatedProfile;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to update profile (${profileId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }

    // Delete a profile by ID
    async delete(profileId: number): Promise<Profile> {
        try {
            const deletedProfile = await prismaClient.profile.delete({
                where: { id: profileId },
            });
            return deletedProfile;
        } catch (err) {
            const error = err as Error;
            throw new Error(`Unable to delete profile (${profileId}): ${error.message}`);
        } finally {
            await prismaClient.$disconnect();
        }
    }
}

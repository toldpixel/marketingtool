import { prismaClient } from '../src/database';

async function seed() {
    // Clear existing data
    await prismaClient.comment.deleteMany();
    await prismaClient.post.deleteMany();
    await prismaClient.profile.deleteMany();
    await prismaClient.user.deleteMany();

    console.log("Existing data deleted.");

    // Create 5 users with profiles
    const users = await prismaClient.user.createMany({
        data: [
            {
                username: "john_doe",
                email: "john@example.com",
                name: "John Doe",
            },
            {
                username: "jane_smith",
                email: "jane@example.com",
                name: "Jane Smith",
            },
            {
                username: "michael_johnson",
                email: "michael@example.com",
                name: "Michael Johnson",
            },
            {
                username: "emily_davis",
                email: "emily@example.com",
                name: "Emily Davis",
            },
            {
                username: "robert_williams",
                email: "robert@example.com",
                name: "Robert Williams",
            },
        ],
    });

    console.log("Users created.");

    // Add profiles for each user
    const userList = await prismaClient.user.findMany();

    for (const user of userList) {
        await prismaClient.profile.create({
            data: {
                bio: `This is the bio for ${user.name}`,
                userId: user.id,
            },
        });
    }

    console.log("Profiles created.");

    // Create posts for each user (5 posts in total)
    const postsData = [
        {
            title: "First Post by John",
            content: "This is the first post written by John Doe.",
            published: true,
            authorId: userList[0].id,
        },
        {
            title: "Second Post by John",
            content: "Another post written by John.",
            published: false,
            authorId: userList[0].id,
        },
        {
            title: "First Post by Jane",
            content: "This is Jane's first post.",
            published: true,
            authorId: userList[1].id,
        },
        {
            title: "Michael's First Post",
            content: "This is Michael's first post.",
            published: true,
            authorId: userList[2].id,
        },
        {
            title: "Emily's First Post",
            content: "This is Emily's first post.",
            published: true,
            authorId: userList[3].id,
        },
    ];

    await prismaClient.post.createMany({
        data: postsData,
    });

    const postList = await prismaClient.post.findMany();

    const commentsData = [
        {
            content: "Great post, John!",
            authorId: userList[1].id,  // Jane comments on John's post
            postId: postList[0].id,    // First Post by John
        },
        {
            content: "Thanks for the insights, Michael.",
            authorId: userList[0].id,  // John comments on Michael's post
            postId: postList[3].id,    // Michael's First Post
        },
        {
            content: "Nice post, Emily!",
            authorId: userList[4].id,  // Robert comments on Emily's post
            postId: postList[4].id,    // Emily's First Post
        },
        {
            content: "I learned a lot from this, Jane.",
            authorId: userList[3].id,  // Emily comments on Jane's post
            postId: postList[2].id,    // First Post by Jane
        },
        {
            content: "Looking forward to more posts, John.",
            authorId: userList[2].id,  // Michael comments on John's post
            postId: postList[1].id,    // Second Post by John
        },
    ];

    await prismaClient.comment.createMany({
        data: commentsData,
    });

    console.log("Comments created.");

    console.log("Posts created.");

    console.log("Seeding completed!");
}

seed()
    .then(async () => {
        await prismaClient.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prismaClient.$disconnect();
        process.exit(1);
    });

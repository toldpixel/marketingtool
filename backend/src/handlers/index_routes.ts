import express from 'express';
import commentRoutes from "./comment_routes";
import postRoutes from "./post_routes";
import profileRoutes from "./profile_routes";
import userRoutes from "./user_routes";

const indexRoutes = (app: express.Application) => {
    commentRoutes(app);
    postRoutes(app);
    profileRoutes(app);
    userRoutes(app);
    return app;
};

export default indexRoutes;
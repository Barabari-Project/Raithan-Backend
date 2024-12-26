import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import createHttpError from "http-errors";
import expressAsyncHandler from "express-async-handler";

export const authServiceProviderMiddleware = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw createHttpError(401, "Unauthorized");
    }

    try {
        const decoded = verifyJwt(token, process.env.PROVIDER_JWT_SECRET!);
        req.userId = decoded.userId;
        next();
    } catch (error: any) {
        throw createHttpError(401, "Invalid token");
    }
});

export const authAdminMiddleware = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw createHttpError(401, "Unauthorized");
    }

    try {
        const decoded = verifyJwt(token, process.env.ADMIN_JWT_SECRET!);
        req.userId = decoded.userId;
        next();
    } catch (error: any) {
        throw createHttpError(401, "Invalid token");
    }
});

export const authSeekerMiddleware = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw createHttpError(401, "Unauthorized");
    }

    try {
        const decoded = verifyJwt(token, process.env.SEEKER_JWT_SECRET!);
        req.userId = decoded.userId;
        next();
    } catch (error: any) {
        throw createHttpError(401, "Invalid token");
    }
});
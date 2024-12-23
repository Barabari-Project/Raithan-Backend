import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const generateJwt = (payload: { userId: string }, expiresIn = "1h"): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw createHttpError(500, 'JWT_SECRET is not defined');
    }
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string): { userId: string } => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw createHttpError(500, 'JWT_SECRET is not defined');
    }
    return jwt.verify(token, secret) as { userId: string };
};

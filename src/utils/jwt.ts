import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const generateJwt = (payload: { userId: string }, secret: string, expiresIn = "1h"): string => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string, secret: string): { userId: string } => {
    return jwt.verify(token, secret) as { userId: string };
};

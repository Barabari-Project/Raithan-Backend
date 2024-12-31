import jwt from "jsonwebtoken";
export const generateJwt = (payload, secret, expiresIn = "365d") => {
    return jwt.sign(payload, secret, { expiresIn });
};
export const verifyJwt = (token, secret) => {
    return jwt.verify(token, secret);
};

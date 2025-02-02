import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;


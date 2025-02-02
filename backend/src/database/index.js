import mongoose from 'mongoose'; 
import { MONGODB_CONNECTION_STRING } from '../config/index.js';

/**
 * Connects to the MongoDB database specified by MONGODB_CONNECTION_STRING.
 *
 * Sets `strictQuery` to false to disable strict query for Mongoose.
 *
 * @throws {Error} If connection to MongoDB fails.
 */

export const dbConnect = async () => {
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(MONGODB_CONNECTION_STRING);
	} catch (error) {
		console.error(`Error: ${error}`);
	}
};


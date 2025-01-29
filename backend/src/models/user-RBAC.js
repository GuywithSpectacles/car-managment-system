// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import { Role } from '../enum/role.js';
// const { Schema } = mongoose;

// const userSchema = new Schema({
// 	name: {
// 		type: String,
// 		required: true
// 	},
// 	email: {
// 		type: String,
// 		unique: true,
// 		required: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	role: {
// 		type: String,
// 		enum: Object.values(Role), // Restrict to Role enum values
// 		default: Role.USER, // Default role is 'User'
// 	},
// },
// {
// 	timestamps: true
// });

// // Pre-save middleware

// /* Purpose:
//     Secure User Passwords
//     Avoid Rehashing Already-Hashed Passwords
// */
// userSchema.pre('save', async function (next) {
// 	if (!this.isModified('password')) return next();
// 	this.password = await bcrypt.hash(this.password, 10);
// 	next();
// });

// export const User = mongoose.model('User', userSchema, 'users');
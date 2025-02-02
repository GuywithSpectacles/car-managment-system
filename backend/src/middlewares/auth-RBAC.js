// import jwt from 'jsonwebtoken';
// import { User } from '../models/user-RBAC.js';
// import {default as UserDTO} from '../dto/user-RBAC.js';
// import * as JWTService from '../utils/JWTService.js';

// /**
//  * Protects routes by validating both the access and refresh tokens.
//  *
//  * This middleware expects both the `accessToken` and `refreshToken` cookies
//  * to be present. If either of them is missing, it returns a 401 Unauthorized
//  * response.
//  *
//  * On successful validation, it assigns the `user` property to the request
//  * object, which is a UserDTO instance of the user who made the request.
//  *
//  * Additionally, it applies role-based authorization if the `roles` argument
//  * is provided. If the user's role is not in the `roles` array, it returns a
//  * 403 Forbidden response.
//  *
//  * @param  {...string} roles - Roles allowed to access the route
//  * @return {import('express').RequestHandler}
//  */
// export const protectAndAuthorize = (...roles) => {
// 	// 1. validation of both the tokens, access and refresh

// 	return async (req, res, next) => {
// 		const { refreshToken, accessToken } = req.cookies;

// 		if (!refreshToken || !accessToken) {
// 			const error = {
// 				status: 401,
// 				message: 'Unauthorized: Tokens missing',
// 			};
// 			return next(error);
// 		}

// 		let _id;
// 		try {
// 			// Try to verify the access token
// 			_id = JWTService.verifyAccessToken(accessToken);
// 		} catch (error) {
// 			// Access token is invalid or expired
// 			return next(error);
// 		}

// 		let user;

// 		try {
// 			// Fetch user and transform into a UserDTO
// 			user = await User.findOne({_id: _id});

// 			const userDTO = new UserDTO(user);
// 			req.user = userDTO;

// 			// Role-based authorization
// 			if (roles.length > 0 && !roles.includes(req.user.role)) {
// 				return next({
// 					status: 403,
// 					message: 'Forbidden: You do not have permission to perform this action',
// 				});
// 			}

// 			next();
// 		} catch (error) {
// 			return next(error);
// 		}
// 	};
// };


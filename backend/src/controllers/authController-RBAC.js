// import Joi from 'joi';
// import  { User } from '../models/user-RBAC.js';
// import bcrypt from 'bcrypt';
// import userDTO from '../dto/user-RBAC.js';
// import { JWTService } from '../utils/JWTService.js';
// import { sendMail } from '../utils/emailService.js';
// import { generatePassword } from '../utils/passwordService.js';
// import { Role } from '../enum/role.js';

// export const authController = {

// 	/**
// 	 * @api {post} /register Register a new user
// 	 * @apiName Register
// 	 * @apiGroup Auth
// 	 * @apiDescription Register a new user. If the user registers as an admin, an email will be sent to the registered email address with a randomly generated password. The user will then be required to use this password to log in. If the user registers as a user, the user will be logged in automatically.
// 	 * @apiParam {String} name Name of the user
// 	 * @apiParam {String} email Email of the user
// 	 * @apiParam {String} role Role of the user (User, Admin)
// 	 * @apiParamExample {json} Request-Example:
// 	 * {
// 	 * 	"name": "John Doe",
// 	 * 	"email": "john.doe@example.com",
// 	 * 	"role": "User"
// 	 * }
// 	 * @apiSuccess {String} accessToken JWT access token
// 	 * @apiSuccess {String} refreshToken JWT refresh token
// 	 * @apiSuccess {Object} user User data
// 	 * @apiSuccessExample {json} Success-Response:
// 	 * {
// 	 * 	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRjMWE4MzgyMmUwMzIzNTU2IiwiaWF0IjoxNjQwNzUxMjkwLCJleHAiOjE2NDA3NzgxOTB9.0K3Q8iX8hjJ4j4i5hJ5i4i4i5hJ4i4i5hJ4i4i5i",
// 	 * 	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRjMWE4MzgyMmUwMzIzNTU2IiwiaWF0IjoxNjQwNzUxMjkwLCJleHAiOjE2NDExMjY4OTB9.vM3Q8iX8hjJ4j4i5hJ5i4i4i5hJ4i4i5hJ4i4i5i",
// 	 * 	"user": {
// 	 * 		"_id": "61dc1a83822e0323556",
// 	 * 		"name": "John Doe",
// 	 * 		"email": "john.doe@example.com",
// 	 * 		"role": "User"
// 	 * 	}
// 	 * }
// 	 * @apiError {String} message Error message
// 	 * @apiErrorExample {json} Error-Response:
// 	 * {
// 	 * 	"message": "Email already in use"
// 	 * }
// 	 */
// 	async register(req, res, next) {
// 		//Validate user input
// 		const userRegisterSchema = Joi.object({
// 			name: Joi.string().max(30).required('Name is required'),
// 			email: Joi.string().email('Invalid email').required('Email is required'),
// 			role: Joi.string()
// 				.valid(...Object.values(Role)) // Restrict to valid roles
// 				.default(Role.USER),
// 		});

// 		const { error } = userRegisterSchema.validate(req.body);
// 		if (error) {
// 			return next(error);
// 		}

// 		const { name, email, role } = req.body;

// 		try {
// 			const emailInUse = await User.exists({email});
// 			if(emailInUse) {
// 				const error = {
// 					status: 409,
// 					message: 'Email already in use'
// 				};
// 				return next(error);
// 			}
// 		}
// 		catch(error) {
// 			return next(error);
// 		}

// 		// Enforce role restrictions (prevent normal users from assigning themselves as Admin)
// 		const isAdmin = req.user?.role === Role.ADMIN; // Check if the request is from an Admin
// 		const userRole = isAdmin && role === Role.ADMIN ? Role.ADMIN : Role.USER;

// 		//  generate password
// 		const password = await generatePassword();
// 		const salt = await bcrypt.genSalt(10);
// 		const hashedPassword = await bcrypt.hash(password, salt);

// 		// store user data in database
// 		let accessToken;
// 		let refreshToken;
// 		let user;

// 		try {
// 			const userToRegister = new User({
// 				name,
// 				email,
// 				password: hashedPassword,
// 				role: userRole
// 			});

// 			user = await userToRegister.save();
// 			await sendMail(email, password);

// 			// Generate JWT tokens
// 			accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
// 			refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');
// 		}
// 		catch(error) {
// 			return next(error);
// 		}

// 		// store refresh token in db
// 		await JWTService.storeRefreshToken(refreshToken, user._id);

// 		// send tokens in cookie
// 		res.cookie('accessToken', accessToken, {
// 			maxAge: 1000*60*60*24,
// 			httpOnly: true
// 		});

// 		res.cookie('refreshToken', refreshToken, {
// 			maxAge: 1000*60*60*24,
// 			httpOnly: true
// 		});

// 		const userDto = new userDTO(user);

// 		// 6. response send
// 		return res.status(201).json({
// 			user: userDto,
// 			auth: true
// 		});
        
// 	}
// };


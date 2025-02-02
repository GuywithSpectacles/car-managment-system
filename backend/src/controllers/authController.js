import Joi from 'joi';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { userDTO } from '../dto/user.js';
import { RefreshToken } from '../models/token.js';
import { JWTService } from '../utils/JWTService.js';
import { sendMail } from '../utils/emailService.js'; 
import { generatePassword } from '../utils/passwordService.js';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

export const authController = {

	/**
 * Registers a new user.
 *
 * This function validates the user's input data, checks for existing email usage,
 * generates a password, stores the user's data in the database, sends a welcome email,
 * and generates JWT access and refresh tokens. The tokens are stored in the database
 * and sent to the client as cookies. The response includes the user data and an
 * authentication status.
 *
 * @param {import('express').Request} req - The express request object containing user data.
 * @param {import('express').Response} res - The express response object for sending the response.
 * @param {import('express').NextFunction} next - The express next middleware function for error handling.
 *
 * @returns {void} - Sends a JSON response with the new user data, email status, and auth status.
 *
 * @throws {Object} - Returns a 409 error if the email is already in use, or any other error encountered during the process.
 */

	async register(req, res, next) { 
		//Validate user input 
		const userRegisterSchema = Joi.object({
			name: Joi.string().max(30).required().messages({
				'string.empty': 'Name is required',
				'string.max': 'Name must be at most 30 characters'
			}),
			email: Joi.string().email().required().messages({
				'string.empty': 'Email is required',
				'string.email': 'Invalid email format'
			}),
		});
        

		const { error } = userRegisterSchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const { name, email } = req.body;

		try {
			const emailInUse = await User.exists({email});
			if(emailInUse) {
				const error = {
					status: 409,
					message: 'Email already in use'
				};
				return next(error);
			}
		}
		catch(error) {
			return next(error);
		}

		//  generate password
		const password = await generatePassword();
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// store user data in database
		let accessToken;
		let refreshToken;
		let user;

		try {
			const userToRegister = new User({
				name,
				email,
				password: hashedPassword,
			});

			await sendMail(email, password);
			user = await userToRegister.save();
			

			// Generate JWT tokens
			accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
			refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');
		}
		catch(error) {
			return next(error);
		}

		// store refresh token in db
		await JWTService.storeRefreshToken(refreshToken, user._id);

		// send tokens in cookie
		res.cookie('accessToken', accessToken, {
			maxAge: 1000*60*60*24,
			httpOnly: true
		});

		res.cookie('refreshToken', refreshToken, {
			maxAge: 1000*60*60*24,
			httpOnly: true
		});

		const userDto = new userDTO(user);

		// 6. response send
		return res.status(201).json({
			user: userDto,
			email: 'Sent successfully',
			auth: true
		});
        
	},

	/**
     * @api {post} /login Login
     * @apiName Login
     * @apiGroup Auth
     * @apiDescription Logs in a user
     * @apiParam {String} userName Username of the user
     * @apiParam {String} password Password of the user
     * @apiParamExample {json} Request-Example:
     * {
     * 	"userName": "John Doe",
     * 	"password": "myPassword123"
     * }
     * @apiSuccess {String} accessToken JWT access token
     * @apiSuccess {String} refreshToken JWT refresh token
     * @apiSuccess {Object} user User data
     * @apiSuccessExample {json} Success-Response:
     * {
     * 	"user": {
     * 		"_id": "61dc1a83822e0323556",
     * 		"name": "John Doe",
     * 		"email": "john.doe@example.com"
     * 	},
     * 	"auth": true
     * }
     */
	async login(req, res, next) {
		// 1. Input Validation
		const userLoginSchema = Joi.object({
			email: Joi.string().email().required().messages({
				'string.empty': 'Email is required',
				'string.email': 'Invalid email format'
			}),
			password: Joi.string().pattern(passwordPattern).required()
		});

		// 2. Validation error
		const {error} = userLoginSchema.validate(req.body);

		if(error) {
			return next(error);
		};

		// 3. Username and Password match
		const {email, password} = req.body;

		let user;

		try {
			// Match input credentials
			user = await User.findOne({email});

			if(!user) {
				const error = {
					status: 401,
					message: "This user does not exist, invalid Username"
				};

				return next(error);
			};

			const match = await bcrypt.compare(password, user.password);

			if(!match) {
				const error = {
					status: 401,
					message: "Invalid Password"
				};

				return next(error);
			};
		}
		catch(error) {
			return next(error);
		};

		// token generation
		const accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
		const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

		// update database for the refresh token
		try{       
			await RefreshToken.updateOne(
				{
					_id: user._id
				},
				{
					token: refreshToken
				},
				{upsert: true})
		}
		catch(error) {
			return next(error)
		}

		// send tokens in cookie
		res.cookie('accessToken', accessToken, {
			maxAge: 1000*60*60*24,
			httpOnly: true
		});
        
		res.cookie('refreshToken', refreshToken, {
			maxAge: 1000*60*60*24,
			httpOnly: true
		});

		const userDto = new userDTO(user);

		// 4. Return Response
		return res.status(201).json({
			user: userDto,
			auth: true
		});
	},

	/**
     * Logout user by deleting the refresh token from the database
     * and clearing the cookies.
     * 
     * @param {import('express').Request} req - The express request object, containing refreshToken in the cookies.
     * @param {import('express').Response} res - The express response object, for sending the response.
     * @param {import('express').NextFunction} next - The express next middleware function, to pass control to the next middleware.
     * @return {void} - Sends a JSON response with user set to null and auth set to false.
     */
	async logout(req, res, next) {
		// 1. Delete Refresh Token from the database
		const { refreshToken } = req.cookies
		try{
			await RefreshToken.deleteOne({
				token: refreshToken
			});
		}
		catch(error) {
			return next(error)
		}

		// delete cookie
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');

		// 2. Response
		return res.status(200).json({
			user: null,
			auth: false
		});
	},

	/*************  ✨ Codeium Command ⭐  *************/
	/**
 * Refreshes the authentication tokens for a user.
 *
 * This method extracts the refresh token from the request cookies and verifies it.
 * If the token is valid, it generates new access and refresh tokens, updates the
 * refresh token in the database, and sends both tokens back as cookies in the response.
 * It also includes the user's information in the response.
 *
 * @param {import('express').Request} req - The express request object, containing cookies with refresh token.
 * @param {import('express').Response} res - The express response object, for sending the new tokens.
 * @param {import('express').NextFunction} next - The express next middleware function, to pass control to the next middleware.
 *
 * @returns {void} - Sends a JSON response with updated authentication tokens and user information.
 * 
 * @throws {Object} - Returns a 401 Unauthorized error if the refresh token is invalid or not found.
 */

	/******  5dc4ff87-65d3-477e-9cc9-e0b0344f4fd2  *******/
	async refresh(req, res, next) {
		// 1. Get refreshtoken from the cookies
		const originalRefreshToken = req.cookies.refreshToken;
		let _id;

		try {
			_id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
		}
		catch(error) {
			error = {
				status: 401,
				message: "Unauthorized"
			}

			return next(error);
		}

		// 2. Verify refreshtoken
		try {
			const match = RefreshToken.findOne({
				_id,
				token: originalRefreshToken
			});

			if(!match) {
				const error = {
					status: 401,
					message: "Unauthorized"
				}

				return next(error);
			}
		}
		catch(error)  {
			return next(error);
		}

		// 3. Generate New Token
		try {
			const accessToken = JWTService.signAccessToken({_id}, "30m");
			const refreshToken = JWTService.signRefreshToken({_id}, "60m");

			// 4. Update DB
			await RefreshToken.updateOne(
				{
					_id,
				},
				{
					token: refreshToken,
				}
			);

			// 5. Response
			res.cookie('accessToken', accessToken, {
				maxAge: 1000*60*60*24,
				httpOnly: true
			});
            
			res.cookie('refreshToken', refreshToken, {
				maxAge: 1000*60*60*24,
				httpOnly: true
			});
		}
		catch(error) {
			return next(error)
		}

		const user = await User.findOne({_id});

		const UserDTO = new userDTO(user);

		return res.status(200).json({
			user: UserDTO,
			auth: true
		});
	}
};

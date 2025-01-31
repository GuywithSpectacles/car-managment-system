import { User } from "../models/user.js";
import { userDTO } from "../dto/user.js";
import { JWTService } from "../utils/JWTService.js";
import { Car } from "../models/car.js";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Middleware to authenticate a user by validating access and refresh tokens.
 *
 * This function checks for the presence of `accessToken` and `refreshToken` in
 * the request cookies. If either token is missing, it returns a 401 Unauthorized
 * error. Upon successful validation of the access token, it fetches the user
 * from the database and assigns a UserDTO object to `req.user`.
 *
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 * @param {import('express').NextFunction} next - The express next middleware function.
 */

/******  fff6d354-a0a6-4374-b54f-6354ce818ab8  *******/
export const auth = async (req, res, next) => {
	// 1. validation of both the tokens, access and refresh
    
	const {refreshToken, accessToken} = req.cookies;
    
	if(!refreshToken || !accessToken) {
		const error = {
			status: 401,
			message: 'Unauthorized'
		}
    
		return next(error)
	};
    
	let _id;
    
	try{
		_id = JWTService.verifyAccessToken(accessToken);
	}
	catch(error) {
		return next(error)
	}
    
	let user;
        
    
	try{
		user = await User.findOne({_id: _id});
	}
	catch(error) {
		return next(error);
	}
    
	const UserDTO = new userDTO(user);
    
	req.user = UserDTO;
    
	next();
}

export const checkOwnership = async (req, res, next) => {
	let car;

	if(req.body.carId) {
	  car = await Car.findById(req.body.carId);
	}
	else if(req.params.id) {
	  car = await Car.findById(req.params.id);
	}
	
	if (!car) {
	  return res.status(404).json({ message: "Car not found" })
	}
  
	if (car.owner.toString() !== req.user._id.toString()) {
	  return res.status(403).json({ message: "Not authorized to perform this action" })
	}
  
	next()
  }
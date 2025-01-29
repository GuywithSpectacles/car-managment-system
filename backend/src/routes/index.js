import express from 'express';
export const router = express.Router();
import { auth } from '../middlewares/auth.js';

import { authController } from '../controllers/authController.js';

//signup
router.post('/register', authController.register);
// login
router.post('/login', authController.login);
// logout
router.post('/logout', auth, authController.logout);
// refresh JWT
router.get('/refreshJWT', authController.refresh);


/*

* RBAC


import { User } from '../models/user-RBAC.js';
import { Role } from '../enum/role.js';
import  { protectAndAuthorize } from '../middlewares/auth-RBAC.js';

import { authController } from '../controllers/authController-RBAC.js';



// testing a route

router.get('/test', (req, res) => res.json({
	msg: 'Working!'
}));

//userRouter

//create-admin
router.post('/create-admin', async (req, res, next) => {
	try {
		// Check if any admin exists
		const existingAdmin = await User.findOne({ role: Role.ADMIN });

		if (!existingAdmin) {
			// If no admin exists, allow unrestricted admin creation
			return authController.register(req, res, next);
		}

		// If an admin exists, apply role-based authorization
		const middleware = protectAndAuthorize(Role.ADMIN);
		middleware(req, res, async (error) => {
			if (error) return next(error); // Handle authorization error
			return authController.register(req, res, next);
		});
	} catch (error) {
		next(error);
	}
});

*/




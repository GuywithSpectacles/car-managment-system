import express from 'express';
export const router = express.Router();
import { auth, checkOwnership } from '../middlewares/auth.js';

import { authController } from '../controllers/authController.js';
import { categoryController } from '../controllers/categoryController.js';
import { carController } from '../controllers/carController.js';
import { upload } from '../utils/multer.js';

//signup
router.post('/register', authController.register);
// login
router.post('/login', authController.login);
// logout
router.post('/logout', auth, authController.logout);
// refresh JWT
router.get('/refreshJWT', authController.refresh);

//get all categories
router.get('/get-all-categories',  categoryController.getAllCategories);
//create category
router.post('/admin/create-category', auth, categoryController.createCategory);
//update category
router.put('/admin/update-category', auth, categoryController.updateCategory);
//delete category
router.delete('/admin/delete-category/:id', auth, categoryController.deleteCategory);


//create car
router.post('/create-car', auth, upload.single('image'), carController.createCar);
//get all cars
router.get('/get-all-cars', carController.getCars);
//get car by ID
router.get('/get-car/:id', carController.getCar);
//update car
router.put('/update-car', auth, upload.fields([{ name: 'image', maxCount: 1 }]), checkOwnership, carController.updateCar);
//delete car
router.delete('/delete-car/:id', auth, checkOwnership, carController.deleteCar);

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




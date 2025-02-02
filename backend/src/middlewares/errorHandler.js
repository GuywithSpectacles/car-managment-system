import pkg from 'joi';
const { ValidationError } = pkg;

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Error handling middleware for Express applications.
 *
 * This function processes errors that occur in the application, determining the
 * appropriate HTTP status code and error message to send in the response. It handles
 * different types of errors, including validation errors from Joi, by checking the
 * instance and properties of the error object.
 *
 * @param {Object} error - The error object that was thrown.
 * @param {import('express').Request} req - The express request object.
 * @param {import('express').Response} res - The express response object.
 * @param {import('express').NextFunction} next - The express next middleware function.
 *
 * @returns {void} - Sends a JSON response with the error status and message.
 */

/******  bb091818-8735-42d7-ac7b-b6eeec46a71d  *******/
export const errorHandler = (error, req, res, next) => {
	//default errorhandler block
	let status = 500;
	let data = {
		message: 'Internal Server Error'
	};

	//Joi errorhandler block
	if(error instanceof ValidationError) {
		status = 401;
		data.message = error.message;

		return res.status(status).json(data);
	}

	//Status errorhandler block
	if(error.status) {
		status = error.status;
	}

	//Message errorhandler block
	if(error.message) {
		data.message = error.message;
	}

	return res.status(status).json(data);
};
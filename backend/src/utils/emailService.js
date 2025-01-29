import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	port: process.env.EMAIL_PORT || 587, // Default port for SMTP
});

/**
 * Sends a welcome email to the specified user with their password.
 *
 * This function uses the nodemailer library to send an email with
 * the subject "Welcome to Car Management System" and includes the
 * user's password in the email body. The email is sent from the
 * address specified in the environment variables.
 *
 * @param {string} userEmail - The email address of the recipient.
 * @param {string} password - The password to include in the email body.
 * @returns {Promise<Object>} - A promise that resolves to the email
 * information object if the email is sent successfully.
 * @throws {Object} - An error object with status 550 and a message
 * if there is an issue sending the email.
 */

export const sendMail = async (userEmail, password) => {
	try {
		const mailOptions = {
			from: `"Car Management System" <${process.env.EMAIL_USER}>`,
			to: userEmail,
			subject: 'Welcome to Car Management System',
			text: `Hello,\n\nWelcome to the Car Management System!\n\nYour password is: ${password}.\n\nBest regards,\nThe Car Management System Team`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
    
		return info; // Optional, return the email info
	} catch (error) {
		// Handle email errors
		throw {
			status: 550,
			message: error.message,
		};
	}
};

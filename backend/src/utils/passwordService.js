/*************  ✨ Codeium Command ⭐  *************/
/**
 * Generates a random password between 8 and 25 characters long, with at
 * least one lowercase letter, one uppercase letter, and one digit.
 *
 * @returns {string} The generated password
 */
/******  4296f4b1-5a37-4c22-8c64-4d4ce04e087d  *******/
export const generatePassword = () => {
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const digits = '0123456789';
  
	// Ensuring at least one of each required type
	let password = [
		lower[Math.floor(Math.random() * lower.length)],
		upper[Math.floor(Math.random() * upper.length)],
		digits[Math.floor(Math.random() * digits.length)],
	];
  
	// Filling the rest of the password with random characters (8-25 characters total)
	const allChars = lower + upper + digits;
	const length = Math.floor(Math.random() * (25 - 8 + 1)) + 8; // Random length between 8 and 25
  
	while (password.length < length) {
		password.push(allChars[Math.floor(Math.random() * allChars.length)]);
	}
  
	// Shuffle the password array to randomize character positions
	password = password.sort(() => Math.random() - 0.5);
  
	return password.join('');
};  
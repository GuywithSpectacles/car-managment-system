class UserDTO {
	/**
	 * @param {User} user - User document from the database
	 */
	constructor(user) {
		this._id = user._id,
		this.name = user.name,
		this.email = user.email
	}
}

export const userDTO = UserDTO;
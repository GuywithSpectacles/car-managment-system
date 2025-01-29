import mongoose from 'mongoose';

const { Schema } = mongoose;

const refreshTokenSchema = Schema({
	token: {
		type: String,
		required: true
	},
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
},
{timestamps: true}
);

//   ModelName      ModelSchema         DB Collection
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');
import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema({
	name: {
		type: String,
		required: [true, "Please add a category name"],
		unique: true,
		trim: true,
		maxlength: [50, "Name cannot be more than 50 characters"],
	}
},
{
	timestamps: true
});

export const Category = mongoose.model('Category', categorySchema, 'categories');
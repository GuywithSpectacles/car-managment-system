import mongoose from "mongoose";

const { Schema } = mongoose;

const carSchema = new Schema({
	category:  {
		type: mongoose.Schema.ObjectId,
		ref: "Category",
		required: true,
	},
	model: {
		type: String,
		required: true,
		maxLength: 50
	},
	make: {
		type: String,
		required: true,
		maxLength: 50
	},
	year: {
		type: Number,
		required: true,
	},
	color: {
		type: String,
		required: true,
		maxlength: 50,
	},
	registrationNo: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		maxlength: 20,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
		default: 'no-photo.jpg'
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
},
{
	timestamps: true
});

export const Car = mongoose.model("Car", carSchema, "cars");
    
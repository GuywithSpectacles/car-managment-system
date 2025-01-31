import Joi from "joi";
import { Category } from "../models/category.js";
import { CategoryDTO } from "../dto/category.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const categoryController = {

	async createCategory(req, res, next) {
		//validate req body
		const createCategorySchema = Joi.object({
			name: Joi.string().max(50).required(),
		});

		const { error } = createCategorySchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const { name } = req.body;
		let category;

		try {
			const categoryExists = await Category.exists({ name: name });

			if (categoryExists) {
				const error = {
					status: 409,
					message: "Category already exists",
				};
				return next(error);
			}

			category = new Category({
				name: name,
			});

			await category.save();
		} catch (error) {
			return next(error);
		}

		const categoryDTO = new CategoryDTO(category);

		res.status(201).json({
			category: categoryDTO,
		});
	},


	async getAllCategories(req, res, next) {
		try {
			const categories = await Category.find({}).exec();

			const categoriesDTO = categories.map(
				(category) => new CategoryDTO(category)
			);
			res.status(200).json({
				categories: categoriesDTO,
			});
		} catch (error) {
			return next(error);
		}
	},

	
	async updateCategory(req, res, next) {
		// validate req body

		const updateCategorySchema = Joi.object({
			categoryId: Joi.string().regex(mongoIdPattern).required(),
			name: Joi.string().max(50).required(),
		});

		const { error } = updateCategorySchema.validate(req.body);
		if (error) {
			return next(error);
		}

		const { categoryId, name } = req.body;

		let category;

		// finding the category
		try {
			category = await Category.findOne({
				_id: categoryId,
			});
		} catch (error) {
			return next(error);
		}

		//updating the category
		try {
			await Category.updateOne(
				{
					_id: categoryId,
				},
				{
					name: name,
				}
			);
		} catch (error) {
			return next(error);
		}

		return res.status(200).json({
			category: "category updated!",
		});
	},



	async deleteCategory(req, res, next) {
		// validate req body
		const deleteCategorySchema = Joi.object({
			id: Joi.string().regex(mongoIdPattern).required(),
		});

		const { error } = deleteCategorySchema.validate(req.params);
		if (error) {
			return next(error);
		}

		const { id } = req.params;

		try {
			await Category.deleteOne({ _id: id });
		} catch (error) {
			return next(error);
		}

		return res.status(200).json({
			category: "category deleted!",
		});
	},
};

import Joi from "joi";
import { Category } from "../models/category.js";
import { CategoryDTO } from "../dto/category.js";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

export const categoryController = {
  /**
   * Returns all categories in the database.
   *
   * @param {import('express').Request} req - The express request object.
   * @param {import('express').Response} res - The express response object.
   * @param {import('express').NextFunction} next - The express next middleware function.
   *
   * @returns {Promise<void>}
   */

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

  /**
   * Retrieves all categories from the database and returns them.
   *
   * This function fetches all categories, transforms them into DTOs, and sends
   * them in the response. If an error occurs during the process, it forwards
   * the error to the next middleware.
   *
   * @param {import('express').Request} req - The express request object.
   * @param {import('express').Response} res - The express response object.
   * @param {import('express').NextFunction} next - The express next middleware function.
   *
   * @returns {Promise<void>}
   */

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

  /**
   * Updates a category in the database.
   *
   * This function validates the request body, verifies the existence of the
   * category, and updates the category in the database. If an error occurs
   * during the process, it forwards the error to the next middleware.
   *
   * @param {import('express').Request} req - The express request object containing
   *                                          the category data to update.
   * @param {import('express').Response} res - The express response object for sending
   *                                          the response.
   * @param {import('express').NextFunction} next - The express next middleware function
   *                                                for error handling.
   *
   * @returns {Promise<void>}
   */
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

  /**
   * Deletes a category from the database.
   *
   * This function validates the request body to ensure the categoryId is
   * provided and correctly formatted. It then attempts to delete the category
   * with the specified ID from the database. If an error occurs during
   * validation or deletion, it forwards the error to the next middleware.
   *
   * @param {import('express').Request} req - The express request object containing
   *                                          the ID of the category to delete.
   * @param {import('express').Response} res - The express response object for sending
   *                                          the response.
   * @param {import('express').NextFunction} next - The express next middleware function
   *                                                for error handling.
   *
   * @returns {Promise<void>}
   */

  async deleteCategory(req, res, next) {
    // validate req body
    const deleteCategorySchema = Joi.object({
      categoryId: Joi.string().regex(mongoIdPattern).required(),
    });

    const { error } = deleteCategorySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { categoryId } = req.body;

    try {
      await Category.deleteOne({ _id: categoryId });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({
      category: "category deleted!",
    });
  },
};

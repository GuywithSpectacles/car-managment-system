import fs from "fs";
import Joi from "joi";
import path from "path";
import { Car } from "../models/car.js";
import { CarDTO } from "../dto/car.js";
import { CarDetailsDTO } from "../dto/carDetail.js";
import { BACKEND_SERVER_PATH } from "../config/index.js";
import { PaginationService } from "../utils/pagination.js";

const paginationService = new PaginationService(Car);
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const storagePath = path.join(process.cwd(), "storage"); // process.cwd() gets project root

export const carController = {
  // @desc    Get all cars
  // @route   GET /api/cars
  // @access  Public
  async getCars(req, res, next) {
    try {
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: {},
        };

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            options.sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }

        // Fetch cars with populated category field
        const result = await paginationService.paginate({}, options);

        // Populate the category field with only the "name" field
        const populatedCars = await Car.find({ _id: { $in: result.data.map(car => car._id) } })
            .populate("category", "name");

        // Transform response to replace category ID with category name
        const carDTO = populatedCars.map((car) => new CarDTO({
            ...car.toObject(), // Convert Mongoose object to plain JSON
            category: car.category?.name || "Unknown", // Replace category ID with category name
        }));

        res.status(200).json({
            total: result.total,
            cars: carDTO,
        });
    } catch (error) {
        return next(error);
    }
},


  // @desc    Get single car
  // @route   GET /api/cars/:id
  // @access  Public
  async getCar(req, res, next) {
    //validate the id
    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });

    const { error } = getByIdSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { id } = req.params;
    let car;

    try {
      car = await Car.findOne(
        { _id: id },
      )
        .populate("category", "name")
        .populate("owner", "name");
    } catch (error) {
      return next(error);
    }

    if (!car) {
      const error = {
        status: 404,
        message: "Car not found",
      };
      return next(error);
    }


    const carDTO = new CarDetailsDTO(car);

    res.status(200).json({
      data: carDTO,
    });
  },

  // @desc    Create new car
  // @route   POST /api/cars
  // @access  Private
  async createCar(req, res, next) {
    //validate car input
    const createCarSchema = Joi.object({
      categoryId: Joi.string().regex(mongoIdPattern).required(),
      model: Joi.string().max(50).required(),
      make: Joi.string().max(50).required(),
      year: Joi.number().required(),
      color: Joi.string().max(50).required(),
      registrationNo: Joi.string().max(20).required(),
      ownerId: Joi.string().regex(mongoIdPattern).required(),
      description: Joi.string().required(),
      // client side -> base64 encoded string -> decode -> store -> save photopath in db
    });

    const { error } = createCarSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      categoryId,
      model,
      make,
      year,
      color,
      registrationNo,
      ownerId,
      description,
    } = req.body;

    // 2. Handle photo storage and naming convention

    // Get uploaded image from Multer
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required!" });
    }

    // c. save locally
    let imagePath;

    try {
        // Generate a proper filename with ownerId
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${Date.now()}-${ownerId}${fileExtension}`;
        const filePath = path.join("storage", fileName);

        // Save the file from memory to disk
        fs.writeFileSync(filePath, req.file.buffer);
        
        // Set the image URL
        imagePath = `${BACKEND_SERVER_PATH}/storage/${fileName}`;
    } catch (error) {
        return next(error);
    }

    // save car in db

    let car;

    try {
      car = new Car({
        category: categoryId,
        model,
        make,
        year,
        color,
        registrationNo,
        owner: ownerId,
        image: imagePath,
        description,
      });

      await car.save();
    } catch (error) {
      return next(error);
    }

    //response
    const carDTO = new CarDTO(car);

    return res.status(201).json({
      car: carDTO,
    });
  },

  // @desc    Update car
  // @route   PUT /api/cars/:id
  // @access  Private
  async updateCar(req, res, next) {
    //validate car input
    const updateCarSchema = Joi.object({
      carId: Joi.string().regex(mongoIdPattern).required(),
      categoryId: Joi.string().regex(mongoIdPattern).allow(null, ""), // Make optional
      model: Joi.string().max(50).allow(null, ""),
      make: Joi.string().max(50).allow(null, ""),
      year: Joi.number().allow(null, ""),
      color: Joi.string().max(50).allow(null, ""),
      registrationNo: Joi.string().max(20).allow(null, ""),
      description: Joi.string().allow(null, ""),
    });

    const { error } = updateCarSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      carId,
      categoryId,
      model,
      make,
      year,
      color,
      registrationNo,
      description,
    } = req.body;

    // handle image

    let car;

    try {
      car = await Car.findOne({
        _id: carId,
      });
    } catch (error) {
      return next(error);
    }

    if (req.file) {
        let newImagePath;
        try {
            // Delete old image if it exists
            if (car.image && car.image !== "no-photo.jpg") {
                const oldImagePath = path.join("storage", path.basename(car.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Generate new filename with car owner's ID
            const fileExtension = path.extname(req.file.originalname);
            const newFileName = `${Date.now()}-${car.owner}${fileExtension}`;
            const newFilePath = path.join("storage", newFileName);

            // Save the new file from memory to disk
            fs.writeFileSync(newFilePath, req.file.buffer);
            
            // Set new image path
            newImagePath = `${BACKEND_SERVER_PATH}/storage/${newFileName}`;
        } catch (error) {
            return next(error);
        }

      await Car.updateOne(
        {
          _id: carId,
        },
        {
          category: categoryId,
          model,
          make,
          year,
          color,
          registrationNo,
          description,
          image: newImagePath,
        }
      );
    } else {
      await Car.updateOne(
        {
          _id: carId,
        },
        {
          category: categoryId,
          model,
          make,
          year,
          color,
          registrationNo,
          description,
        }
      );
    }

    return res.status(200).json({
      message: "Car updated!",
    });
  },

  // @desc    Delete car
  // @route   DELETE /api/cars/:id
  // @access  Private
  async deleteCar(req, res, next) {
    //validate the id
    const deleteByIdSchema = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });

    const { error } = deleteByIdSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    let car;

    //find the car
    try {
      car = await Car.findById(req.params.id);
    } catch (error) {
      return next(error);
    }

    //delete the image
   // Delete the image (if it exists)
   try {
    if (car.image && car.image !== "no-photo.jpg") {
        const imageFilename = path.basename(car.image); // ✅ Extract only the filename
        const imagePath = path.join("storage", imageFilename);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
} catch (error) {
    return next(error);
}

    //delete the car
    try {
      await Car.deleteOne({ _id: req.params.id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({
      message: "Car deleted!",
    });
  },
};

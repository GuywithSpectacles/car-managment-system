import multer from "multer";
import fs from "fs";

// Ensure storage directory exists
const storageDir = "storage/";
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Store in memory first

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

export const upload = multer({
    storage,  // Use memory storage
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
});

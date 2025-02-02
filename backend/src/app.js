import express from "express"
import { dbConnect } from "./database/index.js"
import { PORT } from "./config/index.js"
import { router } from "./routes/index.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import cookieParser from "cookie-parser"
import xssClean from "xss-clean"
import helmet from "helmet"
import { fileURLToPath } from "url"
import path from "path"
import cors from "cors"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

const app = express()

// Apply CORS to all routes
app.use(cors(corsOptions))

app.use(xssClean())

// Modify helmet configuration to allow images to be loaded
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "blob:", "http://localhost:8500"],
        "default-src": ["'self'", "http://localhost:8500"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
)

app.use(cookieParser())

app.use(express.json())

const storagePath = path.join(__dirname, "..", "storage")

app.use("/storage", (req, res, next) => {
  next()
})

app.use("/storage", express.static(storagePath))

// Define __dirname
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// app.use("/storage", (req, res, next) => {
// 	const filePath = path.join(__dirname, "storage", req.url);
// 	console.log("Serving file:", filePath);
// 	next();
//   }, express.static(path.join(__dirname, "storage")));
  

app.use(router)

dbConnect()

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`BACKEND is live at ${PORT}`)
})


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
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs"; 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  

app.use(router)

dbConnect()

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`BACKEND is live at ${PORT}`)
})


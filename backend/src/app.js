import express from 'express';
import { dbConnect } from './database/index.js';
import  { PORT } from './config/index.js';
import { router } from './routes/index.js';
import {errorHandler} from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import xssClean from 'xss-clean';
import helmet from 'helmet';
import  cors from 'cors'; // to communicate backend with frontend

const corsOptions = {
	origin: ['http://localhost:3000'],
	credentials: true // coz we are using cookies
};

const app = express();

app.use(xssClean());

app.use(helmet());

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());

app.use(router);

dbConnect();

app.use('/storage', express.static('storage'));

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`BACKEND is live at ${PORT}`);
});
const express = require('express');
const dbConnect = require ('./database/index');
const { PORT } = require('./config/index');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const xssClean = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors'); // to communicate backend with frontend

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

dbConnect();

app.use('/storage', express.static('storage'));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`BACKEND is live at ${PORT}`);
});
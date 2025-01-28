const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/index');

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(MONGODB_CONNECTION_STRING);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
};

module.exports = dbConnect;
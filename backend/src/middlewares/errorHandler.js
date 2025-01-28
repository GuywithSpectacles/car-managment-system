const {ValidationError} = require('joi');

const errorHandler = (error, req, res, next) => {
    //default errorhandler block
    let status = 500;
    let data = {
        message: 'Internal Server Error'
    };

    //Joi errorhandler block
    if(error instanceof ValidationError) {
        status = 401;
        data.message = error.message;

        return res.status(status).json(data);
    }

    //Status errorhandler block
    if(error.status) {
        status = error.status;
    }

    //Message errorhandler block
    if(error.message) {
        data.message = error.message;
    }

    return res.status(status).json(data);
};


module.exports = errorHandler; 
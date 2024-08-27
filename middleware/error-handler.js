const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    //set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Check the request and try again later.'
  };

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.errorResponse.keyValue)} field. Please choose another value.`;
    customError.statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    // customError.msg = `Missing values for ${Object.keys(err.errors)}. PLease verify the request and try again.`;
    customError.msg = Object.values(err.errors).map(item => item.message).join(', ');
    customError.statusCode = 400;
  }
  
  if (err.name === 'CastError') {
    // customError.msg = `Missing values for ${Object.keys(err.errors)}. PLease verify the request and try again.`;
    customError.msg = `Wrong value for the ${err.path} ${err.value}. Please check and try again.`;
    customError.statusCode = 404;
  }

  // return res.status(customError.statusCode).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware

const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {

    const user = await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token: user.generateJWT() });
}
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide the login credentials!');
    }

    const user = await User.findOne({email});
    if (!user) {
        throw new UnauthenticatedError(`No user with the email ${email} found!`);
    }

    const isPasswordCorrect = await user.comparePasswords(password);

    if (isPasswordCorrect) {
        const token = user.generateJWT();
        res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
    } else {
        throw new UnauthenticatedError(`User is not authorized!`);
    }


    res.send('login user');
}


module.exports = {
    register,
    login,
}
const Trip = require('../models/Trip');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors')

const getAllTrips = async (req, res) => {
    res.json({ "response": "All trips" });
}
const getTrip = async (req, res) => {
    // const { id: tripId } = req.params;
    // console.log(tripId);
    // const trip = await Task.findOne({ _id: tripId });

    // if (!trip) {
    //     throw new NotFoundError(`The task with id ${tripId} was not found`);
    // }
    // res.status(StatusCodes.OK).json({ trip });
}
const createTrip = async (req, res) => {
    // request example
    // {
    //     "destination": "New York",
    //     "startDate":"2024-12-09",
    //     "duration":5,
    //     "reason": "business"
    // }
    req.body.createdBy = req.user.userId;
    const trip = await Trip.create(req.body);
    res.status(StatusCodes.CREATED).json({ trip });
}
const updateTrip = async (req, res) => {
    res.send('update the trips');
}
const deleteTrip = async (req, res) => {
    res.send('delete the trips');
}



module.exports = {
    getAllTrips,
    getTrip,
    createTrip,
    updateTrip,
    deleteTrip,
}
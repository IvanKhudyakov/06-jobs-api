const Trip = require('../models/Trip');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors')

const getAllTrips = async (req, res) => {
    const userId = req.user.userId;
    const trips = await Trip.find({ createdBy: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ trips, count: trips.length });
}
const getTrip = async (req, res) => {
    // const { id: tripId } = req.params;
    // const createdBy = req.user.userId;
    const { user: { userId }, params: { id: tripId } } = req;

    const trip = await Trip.findOne({ _id: tripId, createdBy: userId });
    
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({ trip });
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
    const { body: {destination, duration, startDate, reason}, user: { userId }, params: { id: tripId }} = req;
    let update = {};
    if (destination==='' || duration==='') {
        throw new BadRequestError('Destination or duration is missing');
    } else {
        update = {
            "destination": destination,
            "duration": duration
        }
    }
    //ByDesign: ignore startDate and reason if empty
    if (startDate && startDate !== '') {
        update.startDate = startDate;
    }
    if (reason && reason !== '') {
        update.reason = reason;
    }
    
    const trip = await Trip.findOneAndUpdate({ _id: tripId, createdBy: userId }, update, {new:true, runValidators:true});
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({trip});
}
const deleteTrip = async (req, res) => {
    const { user: { userId }, params: { id: tripId }} = req;
    //findOneAndDelete looks more feasible since findByIdAndDelete can accept obejct as and filter but for used to just find by id. We use additional filter "user" here.
    const trip = await Trip.findOneAndDelete({ _id: tripId, createdBy: userId });
    if (!trip) {
        throw new NotFoundError(`The trip with id ${tripId} was not found`);
    }
    res.status(StatusCodes.OK).json({ msg: 'Trip was successfully deleted.'});
}

module.exports = {
    getAllTrips,
    getTrip,
    createTrip,
    updateTrip,
    deleteTrip,
}
// const express = require('express');
// const router = express.Router();
// const { body, query } = require('express-validator');
// const rideController = require('../controllers/ride.controller');
// const authMiddleware = require('../middlewares/auth.middleware');


// router.post('/create',
//     authMiddleware.authUser,
//     body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
//     body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
//     body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
//     rideController.createRide
// )

// router.get('/get-fare',
//     authMiddleware.authUser,
//     query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
//     query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
//     rideController.getFare
// )

// router.post('/confirm',
//     authMiddleware.authCaptain,
//     body('rideId').isMongoId().withMessage('Invalid ride id'),
//     rideController.confirmRide
// )

// router.get('/start-ride',
//     authMiddleware.authCaptain,
//     query('rideId').isMongoId().withMessage('Invalid ride id'),
//     query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
//     rideController.startRide
// )

// router.post('/end-ride',
//     authMiddleware.authCaptain,
//     body('rideId').isMongoId().withMessage('Invalid ride id'),
//     rideController.endRide
// )

// module.exports = router;

const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const allowedAreas = ['Upper East Side', 'Harlem', 'Williamsburg', 'Bushwick'];

router.post(
  '/create',
  authMiddleware.authUser,
  body('pickup').isIn(allowedAreas).withMessage('Invalid pickup address'),
  body('destination').isIn(allowedAreas).withMessage('Invalid destination address'),
  body('vehicleType').isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle type'),
  rideController.createRide
);

router.get(
  '/get-fare',
  authMiddleware.authUser,
  query('pickup').isIn(allowedAreas).withMessage('Invalid pickup address'),
  query('destination').isIn(allowedAreas).withMessage('Invalid destination address'),
  rideController.getFare
);

router.post(
  '/confirm',
  body('captainId').isMongoId().withMessage('Invalid captain id'),
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.confirmRide
);

router.get(
  '/start-ride',
  query('captainId').isMongoId().withMessage('Invalid captain id'),
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
  rideController.startRide
);

router.post(
  '/end-ride',
  body('rideId').isMongoId().withMessage('Invalid ride id'),
  rideController.endRide
);

module.exports = router;
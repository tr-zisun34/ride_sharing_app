// const rideService = require('../services/ride.service');
// const { validationResult } = require('express-validator');
// const mapService = require('../services/maps.service');
// const { sendMessageToSocketId } = require('../socket');
// const rideModel = require('../models/ride.model');


// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

// module.exports.getFare = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { pickup, destination } = req.query;

//     try {
//         const fare = await rideService.getFare(pickup, destination);
//         return res.status(200).json(fare);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.confirmRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-confirmed',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.startRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId, otp } = req.query;

//     try {
//         const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//         console.log(ride);

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-started',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.endRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.endRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-ended',
//             data: ride
//         })



//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     } 
// }

const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType
    });

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
    const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate('user')
      .select('-otp');

    captainsInRadius.forEach(captain => {
      sendMessageToSocketId(captain.socketId, {
        event: 'new-ride',
        data: rideWithUser
      });
    });

    res.status(201).json(ride);
  } catch (err) {
    console.error('Create ride error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    console.error('Get fare error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// module.exports.confirmRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('Validation errors:', errors.array());
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId } = req.body;

//   try {
//     const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//     sendMessageToSocketId(ride.user.socketId, {
//       event: 'ride-confirmed',
//       data: ride
//     });

//     return res.status(200).json(ride);
//   } catch (err) {
//     console.error('Confirm ride error:', err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

exports.confirmRide = async (req, res) => {
  try {
    const { rideId, captainId } = req.body;
    const captain = await captainModel.findById(captainId);
    if (!captain) {
      return res.status(401).json({ message: 'Captain not found' });
    }
    const ride = await rideService.confirmRide({ rideId, captain });
    res.status(200).json(ride);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const captainModel = require('../models/captain.model'); // Add this at the top if not present

module.exports.startRide = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.log('Validation errors:', errors.array());
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { rideId, otp, captainId } = req.query;

  try {
    const captain = await captainModel.findById(captainId);
    if (!captain) {
      return res.status(401).json({ message: 'Captain not found' });
    }

    const ride = await rideService.startRide({ rideId, otp, captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-started',
      data: ride
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error('Start ride error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// module.exports.endRide = async (req, res) => {


//   const { rideId, captainId } = req.body;

//   try {
//     const captain = await captainModel.findById(captainId);
//     if (!captain) {
//       return res.status(401).json({ message: 'Captain not found' });
//     }

//     const ride = await rideService.endRide({ rideId, captain });

//     sendMessageToSocketId(ride.user.socketId, {
//       event: 'ride-ended',
//       data: ride
//     });

//     return res.status(200).json(ride);
//   } catch (err) {
//     console.error('End ride error:', err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

module.exports.endRide = async (req, res) => {
  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-ended',
      data: ride
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error('End ride error:', err.message);
    return res.status(500).json({ message: err.message });
  }
};

// module.exports.startRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('Validation errors:', errors.array());
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId, otp } = req.query;

//   try {
//     const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//     sendMessageToSocketId(ride.user.socketId, {
//       event: 'ride-started',
//       data: ride
//     });

//     return res.status(200).json(ride);
//   } catch (err) {
//     console.error('Start ride error:', err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

// module.exports.endRide = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('Validation errors:', errors.array());
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { rideId } = req.body;

//   try {
//     const ride = await rideService.endRide({ rideId, captain: req.captain });

//     sendMessageToSocketId(ride.user.socketId, {
//       event: 'ride-ended',
//       data: ride
//     });

//     return res.status(200).json(ride);
//   } catch (err) {
//     console.error('End ride error:', err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };
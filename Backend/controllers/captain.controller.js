// /*
// const captainModel = require('../models/captain.model');
// const captainService = require('../services/captain.service');
// const blackListTokenModel = require('../models/blackListToken.model');
// const { validationResult } = require('express-validator');


// module.exports.registerCaptain = async (req, res, next) => {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password, vehicle } = req.body;

//     const isCaptainAlreadyExist = await captainModel.findOne({ email });

//     if (isCaptainAlreadyExist) {
//         return res.status(400).json({ message: 'Captain already exist' });
//     }


//     const hashedPassword = await captainModel.hashPassword(password);

//     const captain = await captainService.createCaptain({
//         firstname: fullname.firstname,
//         lastname: fullname.lastname,
//         email,
//         password: hashedPassword,
//         color: vehicle.color,
//         plate: vehicle.plate,
//         capacity: vehicle.capacity,
//         vehicleType: vehicle.vehicleType
//     });

//     const token = captain.generateAuthToken();

//     res.status(201).json({ token, captain });

// }

// module.exports.loginCaptain = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     const captain = await captainModel.findOne({ email }).select('+password');

//     if (!captain) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await captain.comparePassword(password);

//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = captain.generateAuthToken();

//     res.cookie('token', token);

//     res.status(200).json({ token, captain });
// }

// module.exports.getCaptainProfile = async (req, res, next) => {
//     res.status(200).json({ captain: req.captain });
// }

// module.exports.logoutCaptain = async (req, res, next) => {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

//     await blackListTokenModel.create({ token });

//     res.clearCookie('token');

//     res.status(200).json({ message: 'Logout successfully' });
// }
//     */
// const captainModel = require('../models/captain.model');
// const captainService = require('../services/captain.service');
// const blackListTokenModel = require('../models/blackListToken.model');
// const mapService = require('../services/maps.service');
// const { validationResult } = require('express-validator');

// module.exports.registerCaptain = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullname, email, password, vehicle } = req.body;

//     const isCaptainAlreadyExist = await captainModel.findOne({ email });

//     if (isCaptainAlreadyExist) {
//         return res.status(400).json({ message: 'Captain already exist' });
//     }

//     const hashedPassword = await captainModel.hashPassword(password);

//     const captain = await captainService.createCaptain({
//         firstname: fullname.firstname,
//         lastname: fullname.lastname,
//         email,
//         password: hashedPassword,
//         color: vehicle.color,
//         plate: vehicle.plate,
//         capacity: vehicle.capacity,
//         vehicleType: vehicle.vehicleType
//     });

//     const token = captain.generateAuthToken();

//     res.status(201).json({ token, captain });
// }

// module.exports.loginCaptain = async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     const captain = await captainModel.findOne({ email }).select('+password');

//     if (!captain) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await captain.comparePassword(password);

//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = captain.generateAuthToken();

//     res.cookie('token', token);

//     res.status(200).json({ token, captain });
// }

// module.exports.getCaptainProfile = async (req, res, next) => {
//     res.status(200).json({ captain: req.captain });
// }

// module.exports.logoutCaptain = async (req, res, next) => {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

//     await blackListTokenModel.create({ token });

//     res.clearCookie('token');

//     res.status(200).json({ message: 'Logout successfully' });
// }

// // New controller methods for location management
// module.exports.getAvailableLocations = async (req, res, next) => {
//     try {
//         const locations = mapService.getAvailableLocations();
//         res.status(200).json({ locations });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports.updateLocation = async (req, res, next) => {
//     try {
//         const { address } = req.body;
        
//         if (!address) {
//             return res.status(400).json({ message: 'Address is required' });
//         }

//         // Get coordinates for the selected address
//         const coordinates = await mapService.getAddressCoordinate(address);
        
//         // Update captain's location and status
//         const updatedCaptain = await captainModel.findByIdAndUpdate(
//             req.captain._id,
//             {
//                 location: {
//                     ltd: coordinates.ltd,
//                     lng: coordinates.lng,
//                     address: address
//                 },
//                 status: 'active' // Set captain as active when location is updated
//             },
//             { new: true }
//         );

//         res.status(200).json({ 
//             message: 'Location updated successfully',
//             captain: updatedCaptain 
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password, vehicle } = req.body;

  try {
    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
  } catch (error) {
    console.error('Register captain error:', error.message);
    res.status(500).json({ message: 'Failed to register captain' });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ token, captain });
  } catch (error) {
    console.error('Login captain error:', error.message);
    res.status(500).json({ message: 'Failed to login captain' });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    if (!req.captain) {
      return res.status(401).json({ message: 'Unauthorized: Captain not authenticated' });
    }
    res.status(200).json({ captain: req.captain });
  } catch (error) {
    console.error('Get captain profile error:', error.message);
    res.status(500).json({ message: 'Failed to fetch captain profile' });
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout captain error:', error.message);
    res.status(500).json({ message: 'Failed to logout captain' });
  }
};

module.exports.getAvailableLocations = async (req, res, next) => {
  try {
    const locations = await mapService.getAvailableLocations();
    res.status(200).json({ locations });
  } catch (error) {
    console.error('Get available locations error:', error.message);
    res.status(500).json({ message: 'Failed to fetch available locations' });
  }
};

module.exports.updateLocation = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    if (!req.captain) {
      return res.status(401).json({ message: 'Unauthorized: Captain not authenticated' });
    }

    const coordinates = await mapService.getAddressCoordinate(address);

    if (!coordinates || !coordinates.ltd || !coordinates.lng) {
      return res.status(400).json({ message: 'Invalid coordinates for the provided address' });
    }

    const updatedCaptain = await captainModel.findByIdAndUpdate(
      req.captain._id,
      {
        location: {
          ltd: coordinates.ltd,
          lng: coordinates.lng,
          address: address
        },
        status: 'active'
      },
      { new: true }
    );

    if (!updatedCaptain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    res.status(200).json({
      message: 'Location updated successfully',
      captain: updatedCaptain
    });
  } catch (error) {
    console.error('Update location error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update location' });
  }
};
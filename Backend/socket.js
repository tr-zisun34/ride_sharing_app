/*
const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Save socketId for user or captain
        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        // Update captain location
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (
                !location ||
                typeof location.ltd !== 'number' ||
                typeof location.lng !== 'number' ||
                isNaN(location.ltd) ||
                isNaN(location.lng)
            ) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            });
        });

        // Clean up socketId on disconnect
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            await captainModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
            await userModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
        });
    });
}

// Send a message to a specific socketId
const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Sending to socket:', socketId, messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

module.exports = {initializeSocket, sendMessageToSocketId };
*/
const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Save socketId for user or captain
        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`${userType} ${userId} joined with socket ${socket.id}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        // Update captain location (manual selection)
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (
                !location ||
                typeof location.ltd !== 'number' ||
                typeof location.lng !== 'number' ||
                isNaN(location.ltd) ||
                isNaN(location.lng)
            ) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    'location.ltd': location.ltd,
                    'location.lng': location.lng
                });
                console.log(`Updated location for captain ${userId}: ${location.ltd}, ${location.lng}`);
            } catch (error) {
                console.error('Error updating captain location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // Clean up socketId on disconnect
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            await captainModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
            await userModel.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
        });
    });
}

// Send a message to a specific socketId
const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Sending to socket:', socketId, messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };
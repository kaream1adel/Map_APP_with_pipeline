const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mqttHandler = require('./mqtt_handler.js');
const GPS = require('gps');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);



// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the login page initially
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

mqttHandler.run_MQTT(io);

// Set up Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for GPS data from the client
    socket.on('gpsData', (data) => {
        // hena bstlem eldata w el mafrood hen a3mellha puplish.
        //console.log('Received GPS data:', data);
        
        io.emit('gpsDataupdated',(data));

        mqttHandler.publishCoordinates(data,io);

    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



// Listen on a port
const Port = process.env.PORT || 3000;

server.listen(Port, () => {
    //mqttHandler.publishCoordinates(coordinates);
    console.log(`Server is running on port ${Port}`);

});
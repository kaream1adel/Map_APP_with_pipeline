
const fs = require('fs');


const caCert = fs.readFileSync('./ca.pem');


const connectOptions = {
   protocol: 'mqtts',
    port: 8883,
   // port: 10540, // Use the port provided by Ngrok
    host: '100.27.117.60',
    //rejectUnauthorized: false, // Enable certificate validation from non trusted authourity
    ca: caCert,
}

module.exports = {
    connectOptions,
}
/*let number1 = 30.0458658;
let number2 = 31.0658658;
let roundedNumber = number1.toString().substring(0,5) + number2.toString().substring(0,5);
console.log(roundedNumber); */

// start coordinates startLat = 30.044294622423276   startLng = 31.23462603460257






const variableEmitter = require('./coordinates');
/*
variableEmitter.on('LngLatChanged', (currentLngLat) => {
    console.log('myLngLat changed to:', currentLngLat);
    // Add your logic here
});

*/

const mqtt = require('mqtt');
const { connectOptions } = require('./use file/use_mqtts')

let mqttClient; // Declare the MQTT client

module.exports = {

    run_MQTT: function(io) {
        const options = {
            clientId: 'Mariam' + Math.random().toString(16).substring(2, 8),
            clean: true,
            connectTimeout: 4000,
            username: 'mariamm',
            password: 'emqx_test',
            reconnectPeriod: 1000,
        }

        const { protocol, host, port } = connectOptions

        let connectUrl = `${protocol}://${host}:${port}`
        if (['ws', 'wss'].includes(protocol)) {
            connectUrl += '/mqtt'
        }
        mqttClient = mqtt.connect(connectUrl, options)


        var topic = 'test'
        const payload = "nodejs mqtts test"
        const qos = 0

        mqttClient.on('connect', () => {
            console.log(`${protocol}: Connected`)
            
            variableEmitter.on('LngLatChanged', (currentLngLat) => {
                console.log('myLngLat changed to:', currentLngLat);
                // Add your logic here
            });

            mqttClient.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('subscribe error:', error)
                    return
                }
                console.log(`${protocol}: Subscribe to topic '${topic}'`)
            })
        })

        mqttClient.on('message', (topic, message) => {
            console.log('Received Message:', topic, message.toString())
                // Emit the MQTT message to connected clients
            io.emit('mqttMessage', message.toString());
        })

        mqttClient.on('reconnect', (error) => {
            console.log(`Reconnecting(${protocol}):`, error)
        })

        mqttClient.on('error', (error) => {
            console.log(`Cannot connect(${protocol}):`, error)
        })

    },
};

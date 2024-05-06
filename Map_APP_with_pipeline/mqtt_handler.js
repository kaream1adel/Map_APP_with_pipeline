

const mqtt = require('mqtt');
const { connectOptions } = require('./use file/use_mqtts')

///////////////////////////////////////// intialization section ////////////////////////////////////////////

let mqttClient; // Declare the MQTT client
let topic ='initial';
let previousTopic = 'previous';
const MycarID = 'car12345' ;

//prepare options that will sent to the mqtt to connect
const options = {
    clientId: MycarID,
    clean: true,
    connectTimeout: 4000,
    username: 'mariamm',
    password: 'emqx_test',
    reconnectPeriod: 1000,
}

//prepare connecturl that will sent to the mqtt to connect
const { protocol, host, port } = connectOptions
let connectUrl = `${protocol}://${host}:${port}`
if (['ws', 'wss'].includes(protocol)) {
    connectUrl += '/mqtt'
}

const qos = 2


/////////////////////////////////////////end intialization section ////////////////////////////////////////////


///////////////////////////////////////// function section /////////////////////////////////////////////////

function run_MQTT(socket) {

    //connect with the mqtt broker 
    mqttClient = mqtt.connect(connectUrl, options)

    mqttClient.on('connect', () => {
        console.log(`${protocol}: Connected`)
        
        mqttClient.subscribe(topic, { qos }, (error) => {
            if (error) {
                console.log('subscribe error:', error)
                return
            }
            console.log(`${protocol}: Subscribe to topic '${topic}'`)
        })

    })

    mqttClient.on('message', (topic, message) => {
        const payload = JSON.parse(message);

        if (payload.carID != MycarID){  //another car on the map not mine

            // if(payload.state == "unsbscribeOldTopic"){

            //     removeMarkerById(payload.carID);
            // }            

            socket.emit('mqttMessage', payload);
        }

    })

    mqttClient.on('reconnect', (error) => {
        console.log(`Reconnecting(${protocol}):`, error)
    })

    mqttClient.on('error', (error) => {
        console.log(`Cannot connect(${protocol}):`, error)
    })

}
function publishCoordinates(data,socket) {

    const currentTimeObject = { hours, minutes, seconds } = new Date();
    let tempTopic = topic;
    let tempPrevTopic = previousTopic;  

    if (mqttClient && mqttClient.connected) {

        //message that will be published
        let payload = {
            carID: MycarID, // Replace with the actual car ID value
            lng: data[0].toString(), // Replace with the actual longitude value
            lat: data[1].toString(), // Replace with the actual latitude value
            timestamp: currentTimeObject,
            current_topic:tempTopic,
            state:"subscribe" 
        };
        
        tempPrevTopic = tempTopic;
        previousTopic = topic;

        topic = 'T' + data[0].toString().substring(0,2) + data[1].toString().substring(0,2);
        tempTopic = topic;

        if (tempTopic!= tempPrevTopic){

            payload.state = "unsbscribeOldTopic";

            mqttClient.publish(tempPrevTopic, JSON.stringify(payload), { qos }, (error) => {
                if (error) {
                    console.log('subscribe error:', error)
                    return
                }
                socket.emit("delete_markers", null);
            });

            payload.state = "subscribe";

            mqttClient.subscribe(tempTopic, { qos }, (error) => {
                if (error) {
                    console.log('subscribe error:', error)
                    return
                }
                console.log(`Subscribe to topic '${tempTopic}'`)
            })

            mqttClient.unsubscribe(tempPrevTopic, (error) => {
                if (error) {

                    console.log('unsubscribe error:', error);
                    return;
                }
                console.log(`Unsubscribed from topic '${tempPrevTopic}'`);
            });
        }


        mqttClient.publish(topic, JSON.stringify(payload), { qos }, (error) => {
            if (error) {
                console.log('publish error:', error);
                return;
            }
        });

    }else {
        console.log('MQTT client not connected.');
    }
}

/////////////////////////////////////////end function section /////////////////////////////////////////////////


module.exports = {
    run_MQTT,
    publishCoordinates
};

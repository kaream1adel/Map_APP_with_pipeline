/* 
const EventEmitter = require('events');

class VariableEmitter extends EventEmitter {}

const variableEmitter = new VariableEmitter();

const { getRouteCoordinates } = require('./helpers');

var routecoordinates
let intervalId;


29.77778719184814, 30.538408655131622
/////////////////////////////////////////////////////////////////////
const startLat = 29.872844858234387;
const startLng = 30.848679848522227;
const endLat = 29.77778719184814;
const endLng = 30.538408655131622;
const accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';
/////////////////////////////////////////////////////////////////////

let i = 0

function assignCoordinates ()
{
    currentLngLat = routecoordinates[i]
    if(routecoordinates[i + 1])
    {
        i++;
    }
    else
    {
        clearInterval(intervalId);
    }
    variableEmitter.emit('LngLatChanged', currentLngLat);
}


getRouteCoordinates(startLat, startLng, endLat, endLng, accessToken)
    .then(routeCoordinates => {
        //console.log('Route coordinates:', routeCoordinates);
        routecoordinates = routeCoordinates
        intervalId = setInterval(assignCoordinates, 500);
        // Use routeCoordinates as needed
    })
    .catch(error => {
        console.error('Error:', error.message);
    });



module.exports = variableEmitter;

 */
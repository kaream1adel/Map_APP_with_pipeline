
const socket = io('http://localhost:3000'); // Replace with your server URL

mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';



const startLat = 30.030093;
const startLng = 31.232456;
const endLat = 30.045102;
const endLng =  31.235717;
const sim_speed = 100;  

var routeCoordinates;


if (!navigator.geolocation) {
    console.log("Your browser doesn't support geolocation feature!");
} else {
   simulateMovingCar();
}

async function simulateMovingCar() {
    try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${ endLng},${endLat}?steps=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
            const routeSteps = data.routes[0].legs[0].steps;
            let currentStepIndex = 0;
            var route = data.routes[0].geometry;
            routeCoordinates = route.coordinates;
            //console.log('Route coordinates:', routeCoordinates);

            const moveCarAlongRoute = async () => {
                for (let i = 0; i < routeCoordinates.length; i++) {
                    const currentCoordinate = routeCoordinates[i];
                    const nextCoordinate = routeCoordinates[i + 1];
                    // console.log('current coordinates:',currentCoordinate);
                    socket.emit('gpsData', currentCoordinate);
                    if (nextCoordinate) {
                        const currentLngLat = new mapboxgl.LngLat(currentCoordinate[0], currentCoordinate[1]);
                        const nextLngLat = new mapboxgl.LngLat(nextCoordinate[0], nextCoordinate[1]);

                        //duration = calculateDuration(currentLngLat, nextLngLat);

                        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for number of seconds before moving to the next coordinate
                    }
                }
            };
            moveCarAlongRoute();
        } else {
            console.log('No route found.');
        }
    } catch (error) {
        console.error('Error simulating car movement:', error.message);
    }
}



function calculateDuration(startLngLat, endLngLat)
{
    // Calculate distance using Haversine formula
    const earthRadius = 6371000; // Radius of the Earth in meters
    const phi1 = startLngLat.lat * Math.PI / 180;
    const phi2 = endLngLat.lat * Math.PI / 180;
    const deltaPhi = (endLngLat.lat - startLngLat.lat) * Math.PI / 180;
    const deltaLambda = (endLngLat.lng - startLngLat.lng) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = Math.floor(earthRadius * c); // Distance in meters
    duration = Math.floor(distance*300/sim_speed);             

    return duration;
}





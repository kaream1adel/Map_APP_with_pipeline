async function checkIfInTunnel(latitude, longitude) {
    const accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';
    const nearbyLatitude = latitude + 0.00000000000001; // Example nearby latitude (adjust as needed)
    const nearbyLongitude = longitude + 0.00000000000001; // Example nearby longitude (adjust as needed)

    try {
        // Construct the URL for the Directions API
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${nearbyLongitude},${nearbyLatitude}.json?steps=true&access_token=${accessToken}`;

        // Fetch data from the API using 'node-fetch'
        const response = await fetch.default(url);
        const data = await response.json();
        // Check if any step in the route is a tunnel
        if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
            const routeSteps = data.routes[0].legs[0].steps;
            for (const step of routeSteps) {
                console.log('Step containing a tunnel:', JSON.stringify(step, null, 2));
                if (step.intersections && step.intersections.some(intersection => intersection.classes && intersection.classes.includes('tunnel'))) {
                    // If a tunnel is found, return true
                    
                    return true;
                }
            }
        }

        // If no tunnel is found, return false
        return false;
    } catch (error) {
        console.error('Error checking for tunnels:', error.message);
        throw error;
    }
}

module.exports = { checkIfInTunnel };
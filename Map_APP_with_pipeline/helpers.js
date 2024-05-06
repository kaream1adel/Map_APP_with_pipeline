// GPS.js

// Define the function to retrieve routeCoordinates
async function getRouteCoordinates(startLat, startLng, endLat, endLng, accessToken) {
    try {
        const fetch = (await import('node-fetch')).default;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&overview=full&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
            const route = data.routes[0].geometry;
            const routeCoordinates = route.coordinates;
            return routeCoordinates;
        } else {
            throw new Error('No route found.');
        }
    } catch (error) {
        console.error('Error retrieving route coordinates:', error.message);
        throw error;
    }
}

// Export the function
module.exports = { getRouteCoordinates };

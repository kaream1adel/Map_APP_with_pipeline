const socketio = io('http://localhost:3000'); // Replace with your server URL
mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';



///////////////////////////////////////// intialization section ////////////////////////////////////////////

// Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [30.055840, 31.357728],
    zoom: 15
});


// Initialize car icon
const carIcon = document.createElement('div');
carIcon.className = 'car-icon';
carIcon.style.backgroundImage = 'url("./black_car.JPG")';
carIcon.style.width = '30px';
carIcon.style.height = '30px';
carIcon.style.backgroundSize = 'cover';

// set my car icon to a marker
const mymarker = new mapboxgl.Marker(carIcon)
    .setLngLat([map.getCenter().lng, map.getCenter().lat])
    .addTo(map);
    
// Set a custom ID for the marker
const mymarkerId = 'carjohn';
mymarker.getElement().id = mymarkerId;
    
// Initialize marker array
let marker_array = [];
    
// Push the marker object to the marker array
marker_array.push({ id: mymarkerId, marker: mymarker });


    
///////////////////////////////////////// end intialization section ////////////////////////////////////////



///////////////////////////////////////// function section /////////////////////////////////////////////////

function createMarker(payload) {

    // Create a new car icon 
    const redcarIcon = document.createElement('div');
    redcarIcon.className = 'car-icon';
    redcarIcon.style.backgroundImage = 'url("./red_car.png")';
    redcarIcon.style.width = '30px';
    redcarIcon.style.height = '30px';
    redcarIcon.style.backgroundSize = 'cover';

    //set the caricon to a marker
    const marker = new mapboxgl.Marker(redcarIcon)
        .setLngLat([payload.lng, payload.lat])
        .addTo(map);

    const markerId = payload.carID ;
    marker.getElement().id = markerId ;

    // Push the marker object to the markers array
    marker_array.push({ id: markerId, marker: marker });

    marker.setLngLat([payload.lat, payload.lng]);

}

function removeMarkerById(id) {
    const markerIndex = marker_array.findIndex(markerObj => markerObj.id === id);

    if (markerIndex !== -1) {
        const markerObject = marker_array[markerIndex];
        const { marker } = markerObject;

        // Remove the marker from the map
        marker.remove();

        // Remove the marker object from the markers array
        marker_array.splice(markerIndex, 1);

        console.log(`Marker with id ${id} removed.`);
    } else {
        console.log(`Marker with id ${id} not found.`);
    }
}

function removeAllMarkers(){
    for (let i = 0; i < marker_array.length; i++) {
        // Check if marker id is not equal to your marker's id
        if (marker_array[i].id !== mymarkerId) {
            // Remove the marker from the map
            marker_array[i].marker.remove();
            // Remove the marker object from the markers array
            marker_array.splice(i, 1);
            // Decrement the index to account for removed element
            i--;
        }
    }
}

///////////////////////////////////////// End function section //////////////////////////////////////////////




//////////////////////////////////////// event listening section ////////////////////////////////////////////

// it handle ny own coordinate on the map 
socketio.on('gpsDataupdated',(currentdata) => {

    marker_array[0].marker.setLngLat([currentdata[0], currentdata[1]]);
    map.setCenter([currentdata[0], currentdata[1]]);

});


// it handle other marker coordinate in the map 
socketio.on('mqttMessage', (payload) => {

    // Handle the payload in gps.js
    console.log('Received MQTT message in gps.js:', payload);

    if(payload.state == "unsbscribeOldTopic"){

        removeMarkerById(payload.carID);
    }
    else if(payload.state == "subscribe"){

        //check if the car already have a marker in markers array 
        const existingMarker = marker_array.find(marker => marker.id === payload.carID);

        if (existingMarker) {
            // Update existing marker's position 
            existingMarker.marker.setLngLat([payload.lng, payload.lat]);

        }else{

            createMarker(payload);
        }
    }

});

// it delete all the markers of other cars in the map when i get out of the topic
// it remove markers from the map and the markers array 

socketio.on("delete_markers", () => {
    removeAllMarkers();
});


////////////////////////////////////// end event listening section //////////////////////////////////////
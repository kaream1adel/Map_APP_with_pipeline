// mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [31.325047, 30.090838], //nf2 el thawra ay mkan ablee
//     zoom: 16
// });

// var carIcon = document.createElement('div');
// carIcon.className = 'car-icon';
// carIcon.style.backgroundImage = 'url("./black_car.JPG")';
// carIcon.style.width = '30px';
// carIcon.style.height = '30px';
// carIcon.style.backgroundSize = 'cover';
// var marker = new mapboxgl.Marker(carIcon)
//     .setLngLat([31.325047, 30.090838])
//     .addTo(map);

// async function simulateMovingCar() {
//     try {
//         const currentLngLat = marker.getLngLat();
//         const endLongitude = 31.331448; //ay mkan gowa el nf2
//         const endLatitude = 30.088090;
//         const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLngLat.lng},${currentLngLat.lat};${ endLongitude},${endLatitude}?steps=true&access_token=${mapboxgl.accessToken}`;
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
//             const routeSteps = data.routes[0].legs[0].steps;
//             const moveDuration = 2000; //speed el marker 3l map
//             let currentStepIndex = 0;

//             const moveCarAlongRoute = async() => {
//                 if (currentStepIndex < routeSteps.length) {
//                     const step = routeSteps[currentStepIndex];
//                     const maneuverLocation = step.maneuver.location;
//                     const nextLngLat = new mapboxgl.LngLat(maneuverLocation[0], maneuverLocation[1]);

//                     // Animate movement between current and next position el howa ay 7aga
//                     animateMarker(currentLngLat, nextLngLat, moveDuration);

//                     currentLngLat.lng = nextLngLat.lng;
//                     currentLngLat.lat = nextLngLat.lat;

//                     // Check for intersections
//                     const intersections = await checkForIntersections(nextLngLat.lat, nextLngLat.lng);
//                     console.log('Intersections near the car:', intersections);

//                     // Add a marker for each intersection
//                     intersections.forEach(intersection => {
//                         new mapboxgl.Marker()
//                             .setLngLat(intersection)
//                             .addTo(map);
//                     });

//                     currentStepIndex++;
//                     setTimeout(moveCarAlongRoute, moveDuration);
//                 }
//                 /* else {
//                                    // Restart simulation
//                                    //setTimeout(simulateMovingCar, 1);
//                                    simulateMovingCar()
//                                } */
//             };
//             moveCarAlongRoute();
//         } else {
//             console.log('No route found.');
//         }
//     } catch (error) {
//         console.error('Error simulating car movement:', error.message);
//     }
// }

// function animateMarker(startLngLat, endLngLat, duration) {
//     const start = performance.now();
//     const initialLng = startLngLat.lng;
//     const initialLat = startLngLat.lat;
//     const deltaLng = endLngLat.lng - initialLng;
//     const deltaLat = endLngLat.lat - initialLat;

//     function frame() {
//         const elapsed = performance.now() - start;
//         const progress = elapsed / duration;
//         const lng = initialLng + deltaLng * progress;
//         const lat = initialLat + deltaLat * progress;
//         marker.setLngLat([lng, lat]);
//         map.panTo([lng, lat]);
//         if (progress < 1) {
//             requestAnimationFrame(frame);
//         }
//     }

//     requestAnimationFrame(frame);
// }

// async function checkForIntersections(latitude, longitude) {
//     const accessToken = 'pk.eyJ1IjoibWFyaWlhbW0iLCJhIjoiY2xwYmE2bWVoMGhwczJrcXIxNzlvaTgyaiJ9.rDjlQgOMAzkppYwBVeUG2Q';
//     const endLongitude = 31.331448; //ay 7aga
//     const endLatitude = 30.088090;

//     // Check if the current position is close to the end position

//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${longitude},${latitude};${endLongitude},${endLatitude}.json?steps=true&access_token=${accessToken}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
//             const routeSteps = data.routes[0].legs[0].steps;
//             const intersections = [];

//             // Iterate over each route step
//             routeSteps.forEach((step, index) => {
//                 // Check if the step has intersections
//                 if (step.intersections && step.intersections.length > 0) {
//                     // Check if the current step is the last step
//                     const isLastStep = index === routeSteps.length - 1;

//                     step.intersections.forEach(intersection => {
//                         // Check if the intersection is not already in the intersections array
//                         const isNewIntersection = intersections.every(existingIntersection => {
//                             return intersection.location[0] !== existingIntersection[0] || intersection.location[1] !== existingIntersection[1];
//                         });

//                         // If it's a new intersection and not the last step, add it to the array
//                         if (isNewIntersection && !isLastStep) {
//                             intersections.push([intersection.location[0], intersection.location[1]]);
//                         }
//                     });
//                 }
//             });
//             // Check if any step in the route is a tunnel
//             routeSteps.forEach(step => {
//                 if (step.intersections && step.intersections.some(intersection => intersection.classes && intersection.classes.includes('tunnel'))) {
//                     console.log('Step containing a tunnel:', JSON.stringify(step, null, 2));
//                     console.log('Current road is a tunnel.');
//                 }
//             });

//             return intersections;
//         } else {
//             return [];
//         }
//     } catch (error) {
//         console.error('Error checking for intersections:', error.message);
//         throw error;
//     }
// }

// // Start simulation
// simulateMovingCar();
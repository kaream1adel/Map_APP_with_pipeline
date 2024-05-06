/* // Make addWarningMessage globally accessible
function addWarningMessage(messageText) {
    // Create a new message element
    var messageElement = document.createElement('div');
    messageElement.className = 'message warning-message';
    messageElement.textContent = messageText;

    // Append the new message element to the message container
    document.getElementById('message-container').appendChild(messageElement);

    // Scroll to the bottom of the message container to show the latest message
    document.getElementById('message-container').scrollTop = document.getElementById('message-container').scrollHeight;
}
const socket = io();
// Handle incoming MQTT messages
socket.on('mqttMessage', (message) => {
    addWarningMessage(message)
}); */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const dataRef = ref(database, 'sensorData');

function updateSensorDisplay(room, sensor, value, unit, threshold) {
    const sensorId = `${sensor}-${room}`;
    let element = document.getElementById(sensorId);
    if (!element) {
        element = document.createElement('div');
        element.id = sensorId;
        document.getElementById('sensorData').appendChild(element);
    }
    const isConcerning = value > threshold;
    element.className = `sensor ${isConcerning ? 'concerning' : 'safe'}`;
    element.textContent = `${sensor.toUpperCase()}: ${value} ${unit}`;
}

function fetchDataAndDisplay() {
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach((room) => {
                const sensors = data[room];
                Object.keys(sensors).forEach((sensor) => {
                    const { value, unit, threshold } = sensors[sensor];
                    updateSensorDisplay(room, sensor, value, unit, threshold);
                });
            });
        }
    });
}

// Fetch and display sensor data initially
fetchDataAndDisplay();

// Set up Firebase listener to refresh data on changes
onValue(dataRef, () => {
    fetchDataAndDisplay();
});

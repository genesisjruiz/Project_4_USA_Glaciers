const glacier_url = "http://127.0.0.1:5000/api/v1.0/glacier_data";

// Initialize the map
var map = L.map('map').setView([39.8283, -98.5795], 4); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

let allData = [];

// ... (fetchCoordinates, plotMarkers, plotHeatMap, populateStateSelector functions remain the same)
// Define the plotMarkers function
function plotMarkers(jsonData) {
    jsonData.forEach(data => {
        if (data.lat && data.lng) {  // Assuming you're using 'lng' for longitude
            L.marker([data.lat, data.lng]).addTo(map)
                .bindPopup(`<b>Glacier Name: ${data.glac_name}</b>`);  // Display glacier name
        }
    });
}

// Fetch JSON data using D3
d3.json(glacier_url).then(jsonData => { 
    // jsonData should already be an array here
    allData = jsonData;
    plotMarkers(allData);
    //plotHeatMap(allData);
    //populateStateSelector(allData);
}).catch(error => console.error('Error fetching JSON data:', error));
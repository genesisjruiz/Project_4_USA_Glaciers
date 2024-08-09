// Fetch the JSON data
d3.json("https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Resources/state_dashboard_df.json").then((data) => {

  // Get the dropdown element
  var dropdown = d3.select("#selDataset");

  // Extract unique glacier names
  var uniqueGlacNames = [...new Set(data.map(item => item["Glacier Name"]))];

  // Loop through the unique glacier names and append each to the dropdown
  uniqueGlacNames.forEach((glac_name) => {
    dropdown.append("option").text(glac_name).property("value", glac_name);
  });
});

function optionChanged(glac_name) {
  // Fetch the JSON data
  d3.json("https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Resources/state_dashboard_df.json").then((data) => {

    // Filter the data for the object with the selected glacier name
    var filteredData = data.filter(item => item["Glacier Name"] === glac_name)[0];

    // Select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Clear any existing metadata
    panel.html("");

    // Append the desired fields in the specified format
panel.append("h6").html(`<b>Date of Area Analysis:</b> ${filteredData["Area Analysis Date"]}`);
panel.append("h6").html(`<b>Area:</b> ${filteredData["Area"]} km²`);
panel.append("h6").html(`<b>Location:</b> ${filteredData["state_name"]}`);
    

    // Set the view of the map to the coordinates of the selected glacier
    map.setView([filteredData["Latitude"], filteredData["Longitude"]], 10); // 5 is the zoom level
  });
}

var map = L.map('map').setView([47.7511, -120.7401], 4); // Center on Washington State

// Add a base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the JSON data
d3.json("https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Resources/state_dashboard_df.json").then((data) => {

    // Get the dropdown element
    var dropdown = d3.select("#selDataset");

    // Extract unique glacier names
    var uniqueGlacNames = [...new Set(data.map(item => item["Glacier Name"]))];

    // Loop through the unique glacier names and append each to the dropdown
    uniqueGlacNames.forEach((glac_name) => {
        dropdown.append("option").text(glac_name).property("value", glac_name);
    });

    // Add circles for each glacier
    data.forEach((glacier) => {
        L.circle([glacier["Latitude"], glacier["Longitude"]], {
            color: 'blue',
            fillColor: '#888',
            fillOpacity: 0.5,
            radius: 3000 // Adjust radius as needed
        }).addTo(map).bindPopup(`<b>${glacier["Glacier Name"]}</b><br>Status: ${glacier["Glacier Exists?"]}`);
    });
});

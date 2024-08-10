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


//zahra's addition 
// Set dimensions of the plot
const margin = { top: 20, right: 60, bottom: 60, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Create an SVG element to hold the plot
const svg = d3.select("#temperature-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);   


// Parse the date   
 //assuming it's in YYYY-MM-DD format)
const parseDate = d3.timeParse("%Y-%m-%d");

// Replace with your actual data URL
const dataUrl = "https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Resources/state_dashboard_df.json"; // Or your actual API endpoint

// Fetch data from the URL
d3.json(dataUrl).then(function(jsonData) {

  // Process the data
  jsonData.forEach(d => {
    d.date = parseDate(d["Area Analysis Date"]);
    d.temperature = +d["Temperature in F"]; // Convert to number
  });
 // Sort the data by date (ascending order)
 jsonData.sort((a, b) => a.date - b.date);

  // Set up scales (adjust for bar chart)
  const xScale = d3.scaleBand() // Use scaleBand for bar chart
    .domain(jsonData.map(d => d.date))
    .range([0, width])
    .padding(0.1); // Add some padding between bars

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(jsonData, d => d.temperature)])
    .range([height, 0]);


    // Create a color scale (adjust colors and domain as needed)
    const colorScale = d3.scaleLinear()
    .domain([d3.min(jsonData, d => d.temperature), d3.max(jsonData, d => d.temperature)])
    .range(["lightblue", "darkred"]); // Map low temperatures to light blue, high to red

  // Add the bars to the chart
  svg.selectAll(".bar")
    .data(jsonData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.temperature))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.temperature))
      .attr("fill", d => colorScale(d.temperature)); // Use the color scale


  // Add axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")); // Format ticks to show only the year

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .selectAll("text") 
      .attr("transform", "rotate(-45)") 
      .style("text-anchor", "end"); 
//y axix
      svg.append("g")
      .call(d3.axisLeft(yScale)) // Create the y-axis
      .append("text") // Add the y-axis label
        .attr("transform", "rotate(-90)") // Rotate the label
        .attr("y", 0 - margin.left) // Position the label
        .attr("x", 0 - (height / 2)) 
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (F)"); 



   // Add title
   svg.append("text")
   .attr("x", (width / 2))             
   //.attr("y", 0 - (margin.top / 2))
   .attr("text-anchor", "middle")  
   .style("font-size", "18px")   

   .style("text-decoration", "underline")  
   .text("National Average Temperature by Date");

}).catch(function(error) {console.error("Error fetching data:", error);
});
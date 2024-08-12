// Initialize the map
var map = L.map('map').setView([47.7511, -120.7401], 4); // Center on Washington State

// Add a base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the JSON data
const dataUrl = "https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Resources/state_dashboard_df.json";

// Load the data
d3.json(dataUrl).then((data) => {
    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");
    const uniqueGlacNames = [...new Set(data.map(item => item["Glacier Name"]))];
    uniqueGlacNames.forEach((glac_name) => {
        dropdown.append("option").text(glac_name).property("value", glac_name);
    });

    // Add circles for each glacier
    data.forEach((glacier) => {
        L.circle([glacier["Latitude"], glacier["Longitude"]], {
            color: 'blue',
            fillColor: '#888',
            fillOpacity: 0.5,
            radius: 3000 
        }).addTo(map).bindPopup(`<b>${glacier["Glacier Name"]}</b><br>Status: ${glacier["Glacier Exists?"]}`);
    });

    // Initialize the temperature plot
    initializeTemperaturePlot(data);
});

// Handle dropdown changes
function optionChanged(glac_name) {
    d3.json(dataUrl).then((data) => {
        const filteredData = data.find(item => item["Glacier Name"] === glac_name);
        const panel = d3.select("#sample-metadata");
        panel.html("");
        panel.append("h6").html(`<b>Date of Area Analysis:</b> ${filteredData["Area Analysis Date"]}`);
        panel.append("h6").html(`<b>Area:</b> ${filteredData["Area"]} km²`);
        panel.append("h6").html(`<b>Location:</b> ${filteredData["state_name"]}`);
        map.setView([filteredData["Latitude"], filteredData["Longitude"]], 10);
    });
}
//******************* */

// 1. Set up SVG dimensions and margins
const margin = { top: 50, right: 30, bottom: 60, left: 70 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// 2. Create SVG element within the #temperature-plot div
const svg = d3.select("#temperature-plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// 3. Load data from JSON URL
d3.json("https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Dashboard/Resources/json_temperature_data.json")
  .then(data => {

    // 4. Parse Date and Value
    const parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach(d => {
      d.date = parseTime(d.Date);
      d.value = +d.Value;
    });

    // 5. Set up scales
    const x = d3.scaleBand() 
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height, 0]);   

    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(data, d => d.value)]) // Map temperature range to colors
      .interpolator(d3.interpolateRdBu);       // Use blue color interpolation (you can change this)
    
    // 6. Create axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));
    svg.append("g")
      .call(d3.axisLeft(y));   


    // 7. Append bars
    svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value))
      .attr("fill", d => colorScale(d.value)); // Set fill color based on temperature
  

    // 8. Add title
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Temperature over Time");

    // 9. Add X axis label
    svg.append("text")             
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .style("text-anchor", "middle")
        .text("Dates From 1990 to 2024");

    // 10. Add Y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (F)");
  })
  .catch(error => console.error(error));
// Initialize the map
var map = L.map('map').setView([47.7511, -120.7401], 4); // Center on Washington State

// Add a base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the JSON data
const dataUrl = "https://raw.githubusercontent.com/genesisjruiz/Project_4_USA_Glaciers/main/Dashboard/Resources/dashboard_df.json";

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

    // 5. Preprocess data to calculate average temperature per year
    const dataByYear = d3.rollup(data, v => d3.mean(v, d => d.value), d => d.date.getFullYear());

    // 6. Set up scales (update x-scale domain)
    const x = d3.scaleBand() 
      .domain(Array.from(dataByYear.keys())) // Use years as domain
      .range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear()
      .domain([0, d3.max(dataByYear.values())]) // Use max average temperature
      .range([height, 0]);

    const colorScale = d3.scaleSequential()
      .domain([d3.max(dataByYear.values()), d3.min(dataByYear.values())]) // Update color scale domain
      .interpolator(d3.interpolateRdYlBu); 

    // 7. Create axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)); // No need for tickFormat, x-scale already has years

    svg.append("g")
      .call(d3.axisLeft(y)); 

    // 8. Append bars (update data binding and y-value)
    svg.selectAll(".bar")
      .data(Array.from(dataByYear)) // Bind the processed data
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))    // Use the year from the dataByYear entry
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))    // Use the average temperature
        .attr("height", d => height - y(d[1]))
        .attr("fill", d => colorScale(d[1])); 
    // 9. Calculate trend line data
    //import { regressionLinear } from 'd3-regression';
    const trendlineData = d3.regressionLinear()
      .x(d => x(d[0]) + x.bandwidth() / 2) // Center of the bar on x-axis
      .y(d => y(d[1]))(Array.from(dataByYear));

    // 10. Create trend line generator
    
    const trendline = d3.line()
      .x(d => d[0])
      .y(d => d[1]);

    // 11. Append trend line
    svg.append("path")
    .datum(trendlineData)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", trendline);
        

  })
  .catch(error => console.error(error));



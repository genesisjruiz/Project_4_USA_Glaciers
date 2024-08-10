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
            radius: 3000 // Adjust radius as needed
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

// Function to initialize the temperature plot
function initializeTemperaturePlot(data) {
    const margin = { top: 20, right: 60, bottom: 60, left: 50 },
          width = 700 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#temperature-plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m-%d");

    data.forEach(d => {
        d.date = parseDate(d["Area Analysis Date"]);
        d.temperature = +d["Temperature in F"]; // Convert to number
    });

    data.sort((a, b) => a.date - b.date);

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.date))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.temperature)])
        .range([height, 0]);

    const colorScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.temperature), d3.max(data, d => d.temperature)])
        .range(["lightblue", "darkred"]);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.date))
        .attr("y", d => yScale(d.temperature))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.temperature))
        .attr("fill", d => colorScale(d.temperature));

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y"));
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (F)");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("Temperature Over Time");
}

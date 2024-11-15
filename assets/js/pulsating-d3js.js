// Initial data array
const data = [800, 810, 790, 800];
const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 30, left: 50 };

// Create the scales
const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
    .domain([d3.min(data) - 10, d3.max(data) + 10])
    .range([height - margin.bottom, margin.top]);

// Create the SVG container and add axes
const svg = d3.select("#chart");

// Line generator function
const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d))
    .curve(d3.curveMonotoneX);  // Smooth line

// Append the initial line path
svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "rgba(0, 200, 0, 1)")
    .attr("stroke-width", 2)
    .attr("d", line);

// Function to draw the pulsing circle
function drawPulse() {
    const lastIndex = data.length - 1;
    const lastX = xScale(lastIndex);
    const lastY = yScale(data[lastIndex]);

    // Remove any existing pulse circle
    svg.selectAll(".pulse-circle").remove();

    // Append a new pulsing circle
    const pulseCircle = svg.append("circle")
        .attr("class", "pulse-circle")
        .attr("cx", lastX)
        .attr("cy", lastY)
        .attr("r", 5)
        .style("fill", "none")
        .style("stroke", "rgba(0, 200, 0, 1)")
        .style("stroke-width", 2)
        .style("opacity", 1);

    // Animate the pulse circle
    pulseCircle.transition()
        .duration(2000)
        .attr("r", 20)
        .style("opacity", 0)
        .on("end", drawPulse);  // Repeat the animation
}

// Draw the initial circle at the last data point
svg.append("circle")
    .attr("class", "last-point")
    .attr("cx", xScale(data.length - 1))
    .attr("cy", yScale(data[data.length - 1]))
    .attr("r", 5)
    .style("fill", "rgba(0, 200, 0, 1)");

// Start the pulse animation
setInterval(() => {
    drawPulse();
}, 2500);

// Function to update the chart data dynamically
let counter = 1;
setInterval(() => {
    // Update the last value in the data array
    data[data.length - 1] = 800 + counter;

    // Update y-scale domain
    yScale.domain([d3.min(data) - 10, d3.max(data) + 10]);

    // Redraw the line with the updated data
    svg.select(".line")
        .datum(data)
        .attr("d", line);

    // Update the last point
    svg.select(".last-point")
        .attr("cx", xScale(data.length - 1))
        .attr("cy", yScale(data[data.length - 1]));

    counter++;
}, 2000);
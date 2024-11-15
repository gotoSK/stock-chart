// Array to iterate through and plot on the chart
var arr = [800, 810, 790, 800];

// Labels for the x-axis (typically timestamps in a stock chart)
var labels = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', ''];

// Get the canvas element where the chart will be drawn
var ctx = document.getElementById('myChart').getContext('2d');

// Create a gradient background for the line
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(0, 200, 0, 0.3)');
gradient.addColorStop(1, 'rgba(0, 200, 0, 0)');

// Define a variable to control the pulse animation
var pulseRadius = 0;
var pulseGrowing = true;

// Custom plugin to create the pulse effect around the last data point
const pulsePlugin = {
    id: 'pulsePlugin',
    afterDraw(chart) {
        const ctx = chart.ctx;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        const lastIndex = arr.length - 1;

        // Get the position of the last data point
        const lastPoint = meta.data[lastIndex];

        if (lastPoint) {
            const x = lastPoint.x;
            const y = lastPoint.y;

            // Draw the pulsing circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(0, 200, 0, ' + (1 - pulseRadius / 20) + ')';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }

        // Update the pulse radius for the animation
        if (pulseGrowing) {
            pulseRadius += 0.5;  // Increase pulse speed
            if (pulseRadius > 20) pulseGrowing = false;
        } else {
            pulseRadius -= 0.5;
            if (pulseRadius < 0) pulseGrowing = true;
        }
    }
};

// Register the plugin with Chart.js
Chart.register(pulsePlugin);

// Create the chart
var myChart = new Chart(ctx, {
    type: 'line',  // You can change this to 'bar', 'pie', etc.
    data: {
        labels: labels,  // X-axis labels
        datasets: [{
            label: 'Stock Price',  // Name of the dataset
            data: arr,  // The array with values to plot
            borderColor: 'rgba(0, 200, 0, 1)',  // Line color (greenish)
            backgroundColor: gradient,  // Faint background color
            borderWidth: 2,  // Line width
            fill: true,  // Don't fill the area under the line
            pointRadius: function(context) {
                // Show a point only on the last data point
                return context.dataIndex === arr.length - 1 ? 5 : 0;
            },
            pointHoverRadius: 5,  // Hover effect on the last point
            pointBackgroundColor: 'rgba(0, 200, 0, 1)',  // Color for the last point
            pointBorderWidth: function(context) {
                // Make the last point thicker
                return context.dataIndex === arr.length - 1 ? 1 : 0;
            },
            pointBorderColor: 'rgba(0, 200, 0, 1)'  // Border color for the last point
        }]
    },
    options: {
        animation: {
            duration: 0  // Turn off Chart.js animations to control custom animation speed
        },
        scales: {
            x: {
                grid: {
                    display: false,  // Hide gridlines for X-axis
                    color: '#444'  // Color of the gridlines (optional)
                },
                ticks: {
                    color: '#ccc'  // X-axis label color
                }
            },
            y: {
                position: 'right', // Position price scale on the right side
                grid: {
                    display: false,  // Hide gridlines for Y-axis
                    color: '#444'  // Y-axis gridlines color
                },
                ticks: {
                    color: '#ccc'  // Y-axis label color
                },
                beginAtZero: false  // Stock prices don't start from zero
            }
        },
        plugins: {
            legend: {
                display: false  // Disable legend to simplify the chart
            },
            tooltip: {
                mode: 'index',  // Show all points at the same index
                intersect: false,  // Show the tooltip on hover regardless of exact point
                callbacks: {
                    label: function(tooltipItem) {
                        return 'Price: $' + tooltipItem.raw;  // Custom label in tooltip
                    }
                }
            }
        },
        elements: {
            line: {
                tension: 0.4  // Smooth out the line
            }
        }
    }
});

var i = 1;

// Use setInterval to update the chart every 2 seconds
setInterval(function() {
    // Update the last value in the array
    arr[arr.length - 1] = 800 + i;
    
    // Update the chart
    myChart.update();
    
    i++;
}, 2000);  // 2000 milliseconds (2 seconds)
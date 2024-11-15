// Array to iterate through and plot on the chart
// Load the value of 'arr' from SessionStorage, or default to empty array if not set
var arr = sessionStorage.getItem('arr') ? JSON.parse(sessionStorage.getItem('arr')) || [] : [];

// Labels for the x-axis (typically timestamps in a stock chart)
var labels = sessionStorage.getItem('labels') ? JSON.parse(sessionStorage.getItem('labels')) || [] : [];

// Get the canvas element where the chart will be drawn
var ctx = document.getElementById('myChart').getContext('2d');

// Create a gradient background for the line
function updateGradient() {
    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (arr[arr.length - 1] >= arr[0]) {
        // Green gradient for upward trend
        gradient.addColorStop(0, 'rgba(0, 200, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 200, 0, 0)');
    } else {
        // Red gradient for downward trend
        gradient.addColorStop(0, 'rgba(200, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
    }
    return gradient;
}

// Create the chart
var myChart = new Chart(ctx, {
    type: 'line',  // You can change this to 'bar', 'pie', etc.
    data: {
        labels: labels,  // X-axis labels
        datasets: [{
            label: 'Stock Price',  // Name of the dataset
            data: arr,  // The array with values to plot
            borderColor: function() {
                return arr[arr.length - 1] >= arr[0] ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)';
            },  // Line color
            backgroundColor: updateGradient(),  // Faint background color
            borderWidth: 2,  // Line width
            fill: true,  // Don't fill the area under the line
            pointRadius: function(context) {
                // Show a point only on the last data point
                return context.dataIndex === arr.length - 1 ? 5 : 0;
            },
            pointHoverRadius: 5,  // Hover effect on the last point
            pointBackgroundColor: function() {
                return arr[arr.length - 1] >= arr[0] ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)';
            },  // Color for the last point
            pointBorderWidth: function(context) {
                // Make the last point thicker
                return context.dataIndex === arr.length - 1 ? 1 : 0;
            }
        }]
    },
    options: {
        scales: {
            x: {
                grid: {
                    display: false,  // Hide gridlines for X-axis
                },
                ticks: {
                    color: '#ccc',  // X-axis label color
                    font: { size: 12 },
                    callback: function(value, index) {
                        // Check if this is the hovered label
                        return index === this._hoverIndex ? `→ ${labels[index]} ←` : labels[index];
                    }
                }
            },
            y: {
                position: 'right', // Position price scale on the right side
                grid: {
                    display: false,  // Hide gridlines for Y-axis
                },
                ticks: {
                    color: '#ccc',  // Y-axis label color
                    font: { size: 12 },
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
                usePointStyle: true,  // Use point style in tooltip
                callbacks: {
                    title: function(tooltipItems) {
                        // Highlight x-axis label when tooltip is active
                        myChart.options.scales.x.ticks.color = (context) => (
                            tooltipItems[0].dataIndex === context.index ? 'yellow' : '#ccc'
                        );
                        myChart.options.scales.y.ticks.color = (context) => (
                            arr[tooltipItems[0].dataIndex] === context.tick.value ? 'yellow' : '#ccc'
                        );
                        return tooltipItems[0].label;
                    },
                    label: function(tooltipItem) {
                        return 'Price: $' + tooltipItem.raw;  // Custom label in tooltip
                    }
                },
                external: function() {
                    // Reset colors after tooltip
                    setTimeout(() => {
                        myChart.options.scales.x.ticks.color = '#ccc';
                        myChart.options.scales.y.ticks.color = '#ccc';
                        myChart.update();
                    }, 500);
                }
            }
        },
        elements: {
            line: {
                tension: 0.4  // Smooth out the line
            }
        },
        hover: {
            mode: 'index',  // Show tooltip and hover effect on closest point along x-axis
            intersect: false  // Activate hover effect even when not intersecting with the line
        }
    }
});

var i = sessionStorage.getItem('i') ? parseInt(sessionStorage.getItem('i'), 10) : 1;

// Update the chart every 2 seconds and store 'i' in sessionStorage
setInterval(function() {
    arr.push(800 + i);
    labels.push(i);
    
    // Update the gradient and border color based on the trend
    myChart.data.datasets[0].backgroundColor = updateGradient();
    myChart.data.datasets[0].borderColor = arr[arr.length - 1] >= arr[0] ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)';
    myChart.update();

    i++;

    sessionStorage.setItem('arr', JSON.stringify(arr));
    sessionStorage.setItem('labels', JSON.stringify(labels));
    sessionStorage.setItem('i', i);
}, 2000);

// ensure the value of i is saved before the page is unloaded (for data integrity &/or backup for unexpected interruptions)
window.addEventListener("beforeunload", function () {
    sessionStorage.setItem('arr', JSON.stringify(arr));
    sessionStorage.setItem('labels', JSON.stringify(labels));
    sessionStorage.setItem('i', i);
});
// Get the context for each cryptocurrency chart
const bitcoinCtx = document.getElementById('bitcoinChart').getContext('2d');
const ethereumCtx = document.getElementById('ethereumChart').getContext('2d');
const rippleCtx = document.getElementById('rippleChart').getContext('2d');
const litecoinCtx = document.getElementById('litecoinChart').getContext('2d');
const cardanoCtx = document.getElementById('cardanoChart').getContext('2d');
const polkadotCtx = document.getElementById('polkadotChart').getContext('2d');
const binanceCtx = document.getElementById('binanceChart').getContext('2d');
const solanaCtx = document.getElementById('solanaChart').getContext('2d');

// Create charts for each cryptocurrency
const bitcoinChart = createChart(bitcoinCtx, 'Bitcoin Price (USD)', 'rgba(255, 99, 132, 1)');
const ethereumChart = createChart(ethereumCtx, 'Ethereum Price (USD)', 'rgba(54, 162, 235, 1)');
const rippleChart = createChart(rippleCtx, 'Ripple Price (USD)', 'rgba(255, 159, 64, 1)');
const litecoinChart = createChart(litecoinCtx, 'Litecoin Price (USD)', 'rgba(75, 192, 192, 1)');
const cardanoChart = createChart(cardanoCtx, 'Cardano Price (USD)', 'rgba(153, 102, 255, 1)');
const polkadotChart = createChart(polkadotCtx, 'Polkadot Price (USD)', 'rgba(255, 205, 86, 1)');
const binanceChart = createChart(binanceCtx, 'Binance Coin Price (USD)', 'rgba(255, 99, 132, 1)');
const solanaChart = createChart(solanaCtx, 'Solana Price (USD)', 'rgba(54, 162, 235, 1)');

// Function to create a chart
function createChart(ctx, label, borderColor) {
    if (!ctx) {
        throw new Error('ctx is null');
    }

    if (!label) {
        throw new Error('label is null or undefined');
    }

    if (!borderColor) {
        throw new Error('borderColor is null or undefined');
    }

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: borderColor,
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            if (!tooltipItem) {
                                throw new Error('tooltipItem is null or undefined');
                            }
                            return `${tooltipItem.dataset.label}: $${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Time' }
                },
                y: {
                    title: { display: true, text: 'Price (USD)' }
                }
            }
        }
    });
}

// Function to fetch cryptocurrency data
async function fetchCryptoData(cryptos) {
    const results = [];
    const promises = []; // Array to hold the fetch promises

    for (const crypto of cryptos) {
        try {
            // Use AllOrigins as a CORS proxy
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=1`)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            results.push(JSON.parse(data.contents)); // Parse the data from AllOrigins
            promises.push(data); // Store the data for later use
        } catch (error) {
            console.error(`Error fetching data for ${crypto}:`, error);
        }

        // Introduce a delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }

    return results; // Return the results array
}

// Function to initialize charts
async function initializeCharts() {
    const cryptos = ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'cardano', 'polkadot', 'binancecoin', 'solana'];
    const responses = await fetchCryptoData(cryptos);

    try {
        // Get time labels for the chart
        const labels = responses[0]?.prices.map(price => new Date(price[0]).toLocaleTimeString()) || [];

        // Update each chart with corresponding data
        bitcoinChart.data.labels = labels;
        bitcoinChart.data.datasets[0].data = responses[0]?.prices.map(price => price[1]) || [];
        bitcoinChart.update();

        ethereumChart.data.labels = labels;
        ethereumChart.data.datasets[0].data = responses[1]?.prices.map(price => price[1]) || [];
        ethereumChart.update();

        rippleChart.data.labels = labels;
        rippleChart.data.datasets[0].data = responses[2]?.prices.map(price => price[1]) || [];
        rippleChart.update();

        litecoinChart.data.labels = labels;
        litecoinChart.data.datasets[0].data = responses[3]?.prices.map(price => price[1]) || [];
        litecoinChart.update();

        cardanoChart.data.labels = labels;
        cardanoChart.data.datasets[0].data = responses[4]?.prices.map(price => price[1]) || [];
        cardanoChart.update();

        polkadotChart.data.labels = labels;
        polkadotChart.data.datasets[0].data = responses[5]?.prices.map(price => price[1]) || [];
        polkadotChart.update();

        binanceChart.data.labels = labels;
        binanceChart.data.datasets[0].data = responses[6]?.prices.map(price => price[1]) || [];
        binanceChart.update();

        solanaChart.data.labels = labels;
        solanaChart.data.datasets[0].data = responses[7]?.prices.map(price => price[1]) || [];
        solanaChart.update();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Function to toggle other coins
function toggleOtherCoins() {
    const otherCoinsContainer = document.getElementById('other-coins');
    otherCoinsContainer.classList.toggle('hidden');
}

// D3.js Visualization Example
document.addEventListener('DOMContentLoaded', () => {
    // Set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the div with id="d3-chart"
    const svg = d3.select("#d3-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Data for the bar chart
    const data = [
        { crypto: "Bitcoin", price: 48000 },
        { crypto: "Ethereum", price: 3500 },
        { crypto: "Ripple", price: 1 },
        { crypto: "Litecoin", price: 200 },
        { crypto: "Cardano", price: 2.5 }
    ];

    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.crypto))
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear()
        .domain([0, 50000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.crypto))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.price))
        .attr("height", d => height - y(d.price))
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "#ff5722");
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr("fill", "#69b3a2");
        });

    // Add labels
    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.crypto) + x.bandwidth() / 2)
        .attr("y", d => y(d.price) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.price);
});


// console.log(`Data for ${crypto}:`, data);
// Initial data fetch
initializeCharts();


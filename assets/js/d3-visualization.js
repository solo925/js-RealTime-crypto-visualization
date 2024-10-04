// d3-visualization.js
async function drawD3Chart(data) {
    const width = 600;
    const height = 400;
    const svg = d3.select("#d3-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "steelblue");
}

// Sample data
const sampleData = [
    { label: 'Bitcoin', value: 50000 },
    { label: 'Ethereum', value: 3000 },
    { label: 'Ripple', value: 1 },
    { label: 'Litecoin', value: 150 },
    { label: 'Cardano', value: 2 },
    { label: 'Polkadot', value: 35 },
    { label: 'Binance Coin', value: 400 },
    { label: 'Solana', value: 150 }
];

drawD3Chart(sampleData);

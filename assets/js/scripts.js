const bitcoinCtx = document.getElementById('bitcoinChart').getContext('2d');
const ethereumCtx = document.getElementById('ethereumChart').getContext('2d');
const rippleCtx = document.getElementById('rippleChart').getContext('2d');
const litecoinCtx = document.getElementById('litecoinChart').getContext('2d');

const bitcoinChart = new Chart(bitcoinCtx, createChartConfig('Bitcoin Price (USD)', 'rgba(255, 99, 132, 1)'));
const ethereumChart = new Chart(ethereumCtx, createChartConfig('Ethereum Price (USD)', 'rgba(54, 162, 235, 1)'));
const rippleChart = new Chart(rippleCtx, createChartConfig('Ripple Price (USD)', 'rgba(255, 159, 64, 1)'));
const litecoinChart = new Chart(litecoinCtx, createChartConfig('Litecoin Price (USD)', 'rgba(75, 192, 192, 1)'));

function createChartConfig(label, borderColor) {
    return {
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
    };
}

async function fetchCryptoData() {
    const timeframe = document.getElementById('timeframeSelect').value; // Get selected timeframe
    const coins = ['bitcoin', 'ethereum', 'ripple', 'litecoin'];
    const promises = coins.map(coin =>
        fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${timeframe}`)
    );

    try {
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));

        const labels = data[0].prices.map(price => new Date(price[0]).toLocaleTimeString());

        bitcoinChart.data.labels = labels;
        bitcoinChart.data.datasets[0].data = data[0].prices.map(price => price[1]);
        bitcoinChart.update();

        ethereumChart.data.labels = labels;
        ethereumChart.data.datasets[0].data = data[1].prices.map(price => price[1]);
        ethereumChart.update();

        rippleChart.data.labels = labels;
        rippleChart.data.datasets[0].data = data[2].prices.map(price => price[1]);
        rippleChart.update();

        litecoinChart.data.labels = labels;
        litecoinChart.data.datasets[0].data = data[3].prices.map(price => price[1]);
        litecoinChart.update();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initial data fetch
fetchCryptoData();

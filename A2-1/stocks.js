const POLYGON_API_KEY = '6rHqpA12z8Iy9tKuGZbGqQX8IglRBJkM'; 
let stockChart;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('lookup-btn').addEventListener('click', lookupStock);
    loadTopStocks();
});

async function lookupStock() {
    const ticker = document.getElementById('stock-ticker').value.toUpperCase();
    const days = document.getElementById('days-select').value;
    
    if (!ticker) {
        alert('Please enter a stock ticker');
        return;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    const formatDate = (date) => date.toISOString().split('T')[0];
    
    try {
        const response = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&apikey=${POLYGON_API_KEY}`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayChart(data.results, ticker);
        } else {
            alert('No data found for this ticker');
        }
    } catch (error) {
        alert('Error fetching stock data. Please check your API key.');
    }
}

function displayChart(results, ticker) {
    const ctx = document.getElementById('stock-chart').getContext('2d');
    
    const labels = results.map(item => new Date(item.t).toLocaleDateString());
    const prices = results.map(item => item.c);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Closing Price`,
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

async function loadTopStocks() {
    try {
        const response = await fetch('https://apewisdom.io/api/v1.0/filter/all-stocks/page/4');
        const data = await response.json();
        
        const topStocks = data.results.slice(0, 5);
        displayTopStocks(topStocks);
    } catch (error) {
        console.error('Error loading top stocks:', error);
    }
}

function displayTopStocks(stocks) {
    const tbody = document.querySelector('#stocks-table tbody');
    tbody.innerHTML = '';

    stocks.forEach(stock => {
        const row = document.createElement('tr');
        const trendIcon = stock.upvotes > 1 ? '📈' : '📉';
        const trendClass = stock.upvotes > 1 ? 'bullish' : 'bearish';
        
        row.innerHTML = `
            <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
            <td>${stock.mentions}</td>
            <td>${stock.sentiment}</td>
            <td class="${trendClass}">${trendIcon}</td>
        `;
        tbody.appendChild(row);
    });
}
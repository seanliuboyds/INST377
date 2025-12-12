let audioEnabled = false;

function initAudio() {
    console.log(annyang)
    if (annyang) {
        const commands = {
            'hello': function() {
                alert('Hello World');
            },
            'change the color to *color': function(color) {
                document.body.style.backgroundColor = color;
            },
            'navigate to *page': function(page) {
                const pageName = page.toLowerCase();
                if (pageName === 'home') {
                    window.location.href = 'index.html';
                } else if (pageName === 'stocks') {
                    window.location.href = 'stocks.html';
                } else if (pageName === 'dogs') {
                    window.location.href = 'dogs.html';
                }
            }
        };
        
        if (window.location.pathname.includes('stocks.html') || window.location.pathname.endsWith('stocks.html')) {
            commands['lookup *stock'] = function(stock) {
                document.getElementById('stock-ticker').value = stock.toUpperCase();
                if (typeof lookupStock === 'function') {
                    lookupStock();
                }
            };
        }

        if (window.location.pathname.includes('dogs.html') || window.location.pathname.endsWith('dogs.html')) {
            commands['load dog breed *breed'] = function(breed) {
                if (typeof loadBreedInfo === 'function') {
                    loadBreedInfo(breed);
                }
            };
        }

        annyang.addCommands(commands);
        annyang.setLanguage('en');
    }
}

function startAudio() {
    if (annyang) {
        annyang.start({ autoRestart: true, continuous: false });
        audioEnabled = true;
        console.log('Audio started');
    }
}

function stopAudio() {
    if (annyang) {
        annyang.abort();
        audioEnabled = false;
        console.log('Audio stopped');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAudio();
    
    const audioOnBtn = document.getElementById('audio-on');
    const audioOffBtn = document.getElementById('audio-off');
    
    if (audioOnBtn) audioOnBtn.addEventListener('click', startAudio);
    if (audioOffBtn) audioOffBtn.addEventListener('click', stopAudio);

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        loadQuote();
    }
});

async function loadQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/today/');
        const data = await response.json();
        document.getElementById('quote-text').textContent = `"${data[0].q}" - ${data[0].a}`;
    } catch (error) {
        document.getElementById('quote-text').textContent = 'Failed to load quote';
    }
}
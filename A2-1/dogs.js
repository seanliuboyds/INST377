let dogBreeds = [];

document.addEventListener('DOMContentLoaded', function() {
    loadDogImages();
    loadDogBreeds();
});

async function loadDogImages() {
    const carousel = document.getElementById('dog-carousel');
    const images = [];
    
    try {
        for (let i = 0; i < 10; i++) {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            images.push(data.message);
        }
        
        carousel.innerHTML = images.map(img => `<img src="${img}" alt="Random dog">`).join('');
        
        if (typeof simpleslider !== 'undefined') {
            simpleslider.getSlider({
                container: carousel,
                prop: 'img',
                init: 0
            });
        }
    } catch (error) {
        console.error('Error loading dog images:', error);
    }
}

async function loadDogBreeds() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds');
        dogBreeds = await response.json();
        
        const buttonsContainer = document.getElementById('breed-buttons');
        
        dogBreeds.forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.name;
            button.setAttribute('class', 'breed-btn');
            button.addEventListener('click', () => loadBreedInfo(breed.name));
            buttonsContainer.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading dog breeds:', error);
    }
}

function loadBreedInfo(breedName) {
    const breed = dogBreeds.find(b => b.name.toLowerCase() === breedName.toLowerCase());
    
    if (breed) {
        document.getElementById('breed-name').textContent = breed.name;
        document.getElementById('breed-description').textContent = breed.temperament || 'No description available';
        document.getElementById('breed-min-life').textContent = breed.life_span ? breed.life_span.split(' - ')[0] : 'Unknown';
        document.getElementById('breed-max-life').textContent = breed.life_span ? breed.life_span.split(' - ')[1] : 'Unknown';
        
        document.getElementById('breed-info').style.display = 'block';
    } else {
        alert('Breed not found');
    }
}
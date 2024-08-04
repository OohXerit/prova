const socket = io('http://localhost:5000');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const imageCache = new Map();

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawCanvas();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

socket.on('canvasUpdate', (data) => {
    updateCanvas(data);
});

function updateCanvas(data) {
    clearUnusedImages(data.elements);
    data.elements.forEach(element => {
        if (!imageCache.has(element.url)) {
            const img = new Image();
            img.onload = () => {
                imageCache.set(element.url, img);
                redrawCanvas();
            };
            img.src = `http://localhost:5000${element.url}`;
        }
    });
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageCache.forEach((img, url) => {
        const element = canvasData.elements.find(e => e.url === url);
        if (element) {
            ctx.drawImage(img, element.x, element.y);
        }
    });
}

function clearUnusedImages(elements) {
    const activeUrls = new Set(elements.map(e => e.url));
    imageCache.forEach((value, key) => {
        if (!activeUrls.has(key)) {
            imageCache.delete(key);
        }
    });
}

let canvasData = { elements: [] };

// Iniziale caricamento del canvas
fetch('http://localhost:5000/api/canvas')
    .then(response => response.json())
    .then(data => {
        canvasData = data;
        updateCanvas(data);
    });
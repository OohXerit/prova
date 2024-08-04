const socket = io('http://localhost:5000');
const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const loginBtn = document.getElementById('login-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const xCoord = document.getElementById('x-coord');
const yCoord = document.getElementById('y-coord');
const adminCanvas = document.getElementById('admin-canvas');
const ctx = adminCanvas.getContext('2d');

loginBtn.addEventListener('click', login);
uploadBtn.addEventListener('click', uploadFile);

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            loginForm.style.display = 'none';
            adminPanel.style.display = 'block';
            loadCanvasData();
        } else {
            alert('Login failed');
        }
    });
}

function uploadFile() {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('x', xCoord.value);
    formData.append('y', yCoord.value);

    const endpoint = file.type.startsWith('image/gif') ? '/api/canvas/add-gif' : '/api/canvas/add-image';

    fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadCanvasData();
    });
}

function loadCanvasData() {
    fetch('http://localhost:5000/api/canvas')
        .then(response => response.json())
        .then(data => updateAdminCanvas(data));
}

function updateAdminCanvas(data) {
    ctx.clearRect(0, 0, adminCanvas.width, adminCanvas.height);
    data.elements.forEach(element => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, element.x, element.y);
        };
        img.src = `http://localhost:5000${element.url}`;
    });
}

socket.on('canvasUpdate', (data) => {
    updateAdminCanvas(data);
});
import a from './a'
import b from './b'
var app = document.querySelector("#app"),
    p = document.createElement('p'),
    img = document.createElement('img');

p.innerHTML = b;
img.src = a;
app.appendChild(p)
app.appendChild(img)



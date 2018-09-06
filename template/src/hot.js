import b from './b'
var app = document.querySelector("#app"),
    p = document.createElement('p'),
    img = document.createElement('img');

export default () => {
    app.innerHTML = "";
    p.innerHTML = b;
    img.src = "./static/image/sp_black.png";
    app.appendChild(p)
    app.appendChild(img)
}

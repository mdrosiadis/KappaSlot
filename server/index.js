const express = require('express');

const app = express();
const port = 8000;


app.get('/', (req, res) => {
    res.send("\
    <h1 style='color: #ff0000'>Hello </h1>\
    <script>function woah(){console.log('Click');}</script>\
    <button onclick='woah()'>Click</button>\
    ");
});

app.get('/test', (req, res) => {
    res.send("monkaS");
});

app.listen(port, () => {console.log(`Listening on port ${port}...`)});


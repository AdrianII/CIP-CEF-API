const express = require('express') //llamamos a Express
const app = express();
const cors = require('cors');
const caliente = require('./routes/cipCaliente');              
const frio = require('./routes/cipFrio');              

const port = process.env.PORT || 8080  // establecemos nuestro puerto

var corsOptions = {
    origin: 'http://127.0.0.1:3002',
    //origin: 'http://10.21.64.101:333',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions)); // Permitir peticiones desde React

app.get('/', function(req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })   
})

app.get('/testPdf', function(req, res) {
  const img = req.bocy.img;

  res.json({ mensaje: '¡Hola Mundo!' })   
})
app.use('/api/caliente', caliente);
app.use('/api/frio', frio);
// iniciamos nuestro servidor

app.listen(port)
console.log('API escuchando en el puerto ' + port)
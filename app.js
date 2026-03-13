// app.js
'use strict'

// cargar modulos 
var express = require('express')
var bodyParser = require('body-parser')


// ejecutar express (http)
var app = express();


// cargar rutas 
var article_routes = require('./routes/article');


// Midelware 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Cors

// añadir prefijos a las rutas
app.use('/api', article_routes);

// exportar el modulo
module.exports = app;
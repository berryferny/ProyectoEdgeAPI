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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// añadir prefijos a las rutas
app.use('/api', article_routes);

// exportar el modulo
module.exports = app;
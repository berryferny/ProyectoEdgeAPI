// index.js
'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var port = 3900;

mongoose.connect('mongodb://localhost:27017/api_blog')
.then(() => {
    console.log('Estamos dentro')
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`)

    })
})
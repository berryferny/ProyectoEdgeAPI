// controllers/article.js
'use strict'
var validator = require('validator');
var Article = require('../models/article');

var controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: "Este es el endpoint de prueba para el controlador de articulos"
        })
    },

    save: async (req, res) => {
        //crear el objeto 
        var params = req.body;

        //Validar datos
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'

            })

        }
        try {
            if (validate_title && validate_content) {
                //crear el objeto a guardar
                var article = new Article();

                article.title = params.title;
                article.content = params.content;
                article.image = null;

                // guardar el articulo el BD

                const articleStore = await article.save();

                return res.status(200).send({
                    status: 'sucess',
                    article: articleStore

                })
            }
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'

            })
        }


    },

    getArticles: async (req, res) => {
        try {
            const articles = await Article.find({}).sort('-_id');

            if (!articles || articles.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: "No tiene datos"
                });
            }
            return res.status(200).send({
                status: 'sucess',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: "Error al traer los datos"

            });
        }
    },
    getArticlesByLimit: async (req, res) => {
        var last = req.params.last;
        try {
            const articles = await Article.find({}).limit(last).sort('-_id');
            if (!articles || articles.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    articles
                });
            }
            return res.status(200).send({
                status: 'sucess',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: "Error al traer los datos"

            });
        }
    },
    getArticle: async (req, res) => {
        var articleId = req.params.id;
        try {
            const articles = await Article.findById(articleId);
            if (!articles || articles.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    articles
                });
            }
            return res.status(200).send({
                status: 'sucess',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: "Error al traer los datos"

            });
        }
    }

}

module.exports = controller;
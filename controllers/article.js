'use strict';

var validator = require('validator');
var Article = require('../models/article');
const { get } = require('mongoose');
const { search } = require('../routes/article');

var controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Test action is running'
        });
    },

    save: async (req, res) => {

        var params = req.body;

        try {
            var validate_title = !validator.isEmpty(params.title || '');
            var validate_content = !validator.isEmpty(params.content || '');
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (!validate_title || !validate_content) {
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }

        try {

            var article = new Article();

            article.title = params.title;
            article.content = params.content;
            article.image = null;

            const articleStored = await article.save();

            return res.status(200).send({
                status: 'success',
                article: articleStored
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al guardar el artículo'
            });
        }
    },

    getArticles: async (req, res) => {
        try {
            const articles = await Article.find({}).sort('-_id');

            if (!articles || articles.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al obtener los artículos'
            });
        }
    },

    getArticlesByLimit: async (req, res) => {
        var last = req.params.last;
        try {
            const articles = await Article.find({}).limit(last).sort('-_id');

            if (!articles || articles.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al obtener los artículos'
            });
        }
    },

    getArticle: async (req, res) => {
        var articleId = req.params.id;

        try {
            const articles = await Article.findById(articleId);

            if (!articles || articles.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay artículos para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al obtener los artículos'
            });
        }
    },

    update: async (req, res) => {
        var articleId = req.params.id;
        var params = req.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if (validate_title && validate_content) {
            try {
                let articleUpdated = await Article.findOneAndUpdate(
                    { _id: articleId },
                    { $set: params },
                    { new: true }
                );

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha actualizado el artículo'
                    });
                }

                return res.status(400).send({
                    status: 'success',
                    article: articleUpdated
                });

            } catch (error) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar !!!'
                });
            }

        } else {
            return res.status(400).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }
    },

    delete: async (req, res) => {
        var articleId = req.params.id;

        try {
            const articleRemoved = await Article.findOneAndDelete({ _id: articleId });

            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha eliminado el artículo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar'
            });
        }
    },

    Upload: async (req, res) => {
        var file_name = 'Imagen no subida ...';

        if (!req.file) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            return res.status(200).send({
                status: 'error',
                message: 'La extensión de la imagen no es válida'
            });
        } else {
            var articlId = req.params.id;

            let articleUpdate = await Article.findOneAndUpdate(
                { _id: articlId },
                { image: file_name },
                { new: true }
            );

            if (!articleUpdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al subir imagen del artículo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleUpdate,
            });
        }
    },

    getImage: async (req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file

        fs.acces(path_file, fs.constants.F_OK, (error) => {
            console.log(error)
            if (error) {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            } else {
                return res.sendFile(path.resolve(path_file));
            }
        } )
    },
    search : async (req, res) => {
        var searchString = req.params.search;

        try {
            const articles = await Article.find({
                "$or": [
                    { "title": { "$regex": searchString, "$options": "i" } },
                    { "content": { "$regex": searchString, "$options": "i" } }
                ]
            }).sort([['date', 'descendiing']]);

            if (!articles || articles.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontraron artículos'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error en la búsqueda'
            });
        }
    }

};

module.exports = controller;
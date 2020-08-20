const ArticleCollection = require('../collection/Article');

/**
 * Allow us to get all Articles.
 * @param {*} request 
 * @param {*} reply 
 */
getArticles = async (request, reply) => {
    await ArticleCollection.find(null, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
};

/**
 * Allow us to get article by slug.
 * @param {*} request 
 * @param {*} reply 
 */
getArticleBySlug = async (request, reply) => {
    await ArticleCollection.findOne({ slug: request.params.slug }, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
}

/**
 * Allow us to add an article.
 * @param {*} request 
 * @param {*} reply 
 */
addArticle = async (request, reply) => {
    const newArticle = await new ArticleCollection(request.body).save();
    
    reply.send(newArticle);
}

/**
 * Allow us to edit an article by ID.
 * @param {*} request 
 * @param {*} reply 
 */
editArticle = async (request, reply) => {
    await ArticleCollection.findById(request.params.id, (error, result) => {
        if (error) {
            reply.send(error);
        }

        result.title = request.body.title || result.title;
        result.description = request.body.description || result.description;

        result.save(function(error) {
            if (error) {
                reply.send(error);
            }

            reply.send(result);
        })
    });
}

/**
 * Allow us to delete an article by id.
 * @param {*} request 
 * @param {*} reply 
 */
deleteArticle = async (request, reply) => {
    await ArticleCollection.deleteOne({ _id: request.params.id }, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
}

module.exports = { getArticles, getArticleBySlug, addArticle, editArticle, deleteArticle }; 

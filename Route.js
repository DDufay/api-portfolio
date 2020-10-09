const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt = 10;

const projectController = require('./controller/Project');
const articleController = require('./controller/Article');
const UserCollection = require('./collection/User');


/**
 * Swagger options to configure data in swagger ui http://localhost:3004/api-docs/
 */
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Portfolio API',
            description: 'This is my portfolio swagger',
            version: '1.0.0',
            contact: {
                name: 'Dylan Dufay'
            },
            servers: ['htpp://localhost:3004']
        }
    },
    apis: ['Route.js']
};

module.exports = function(app) {
    app.get('/', async (request, reply) => {
        // bcrypt.hash('Dylan', salt, (error, result) => {
        //     if (error) {
        //         reply.send(error);
        //     }

        //     const user = new UserCollection({
        //         username: 'Dylan',
        //         password: result,
        //     }).save();

        //     reply.send(user);
        // });
        const user = await UserCollection.find();

        reply.send(user);
    });

    app.post('/login', async (request, reply) => {
        const username = request.body.username;

        UserCollection.findOne({ username }, (error, user) => {
            if (error) {
                reply.send(error);
            } 
            
            bcrypt.compare(request.body.password, user.password, function (err, result) {
                if (err) {
                    reply.send(err);
                } 
            
                if (result === true) {
                    const userJwt = { username: user.username, password: user.password }
                    const accessToken = generateAccessToken(userJwt);
                    const refreshToken = jwt.sign(userJwt, process.env.REFRESH_TOKEN_SECRET);
                    user.refreshToken = refreshToken;
                    user.save();
                    reply.json({ accessToken, refreshToken });
                } else {
                    reply.send('Incorrect password');
                }
            })
        });
    });

    app.post('/token', (req, res) => {
        const refreshToken = req.body.token;

        if (refreshToken === null) {
            return res.sendStatus(401);
        }

        //todo check if token is valid refreshToken === user.refreshToken
        if (refreshToken !== '') {
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.sendStatus(403);
            }

            const accessToken = generateAccessToken({ name: user.name });

            res.json({ accessToken });
        });
    });

    app.delete('/logout', authenticateToken, (req, res) => {
        const username = req.body.username;

        UserCollection.findOne({ username }, (error, user) => {
            if (error) {
                res.send(error);
            }

            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (err) {
                    res.send(err);
                } 
            
                if (result === true) {
                    user.refreshToken = '';
                    user.save();
                    res.sendStatus(204);
                } else {
                    res.send('Incorrect password');
                }
            })
        });
    });


    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(swaggerDocs));

    /**
     * @swagger
     * /projects:
     *  get:
     *   summary: Use to request all projects.
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.get('/projects', projectController.getProjects);

    /**
     * @swagger
     * /projects/{project}:
     *  get:
     *   summary: Use to request one project by id.
     *   parameters:
     *     - in: path
     *       name: project
     *       description: Id of project.
     *       required: true
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.get('/projects/:project', projectController.getProject);

    /**
     * @swagger
     * /projects:
     *  post:
     *   summary: Use to add a project.
     *   consumes:
     *     - application/json
     *   parameters:
     *      - in: body
     *        name: project
     *        description: The project to create.
     *        schema:
     *          type: object
     *          properties:
     *            title:
     *              type: string
     *            description:
     *              type: string
     *            date:
     *              type: string
     *            technologies:
     *              type: string
     *            picture:
     *              type: string
     *            detailPicture:
     *              type: string
     *            github:
     *              type: string
     *            site:
     *              type: string
     *            details:
     *              type: array
     *              items: []
     *   responses:
     *     200:
     *       description: Succesful. 
     */
    app.post('/projects', authenticateToken, projectController.addProjects);

    /**
     * @swagger
     * /projects/{project}:
     *  put:
     *   summary: Use to edit a project by id.
     *   consumes:
     *     - application/json
     *   parameters:
     *      - in: body
     *        name: project
     *        description: The project to edit.
     *        schema:
     *          type: object
     *          properties:
     *            title:
     *              type: string
     *            description:
     *              type: string
     *            date:
     *              type: string
     *            technologies:
     *              type: string
     *            picture:
     *              type: string
     *            detailPicture:
     *              type: string
     *            github:
     *              type: string
     *            site:
     *              type: string
     *            details:
     *              type: array
     *              items: []
     *      - in: path
     *        name: project
     *        description: Id of project.
     *        required: true
     *   responses:
     *     200:
     *       description: Succesful. 
     */
    app.put('/projects/:project', authenticateToken, projectController.editProjects);

    /**
     * @swagger
     * /projects/{project}:
     *  delete:
     *   summary: Use to delete one project by id
     *   parameters:
     *     - in: path
     *       name: project
     *       description: Id of project.
     *       required: true
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.delete('/projects/:project', authenticateToken, projectController.deleteProject);


    /**
     * @swagger
     * /articles:
     *  get:
     *   summary: Use to request all articles.
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.get('/articles', articleController.getArticles);

    /**
     * @swagger
     * /articles/{slug}:
     *  get:
     *   summary: Use to request one article by slug.
     *   parameters:
     *     - in: path
     *       name: slug
     *       description: Slug of article.
     *       required: true
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.get('/articles/:slug', articleController.getArticleBySlug);

    /**
     * @swagger
     * /articles:
     *  post:
     *   summary: Use to add an article.
     *   consumes:
     *     - application/json
     *   parameters:
     *      - in: body
     *        name: article
     *        description: The article to create.
     *        schema:
     *          type: object
     *          properties:
     *            title:
     *              type: string
     *            description:
     *              type: string
     *   responses:
     *     200:
     *       description: Succesful. 
     */
    app.post('/articles', authenticateToken, articleController.addArticle);


    /**
     * @swagger
     * /articles/{id}:
     *  put:
     *   summary: Use to edit an article by id.
     *   consumes:
     *     - application/json
     *   parameters:
     *      - in: body
     *        name: article
     *        description: The article to edit.
     *        schema:
     *          type: object
     *          properties:
     *            title:
     *              type: string
     *            description:
     *              type: string
     *      - in: path
     *        name: id
     *        description: Id of article.
     *        required: true
     *   responses:
     *     200:
     *       description: Succesful. 
     */
    app.put('/articles/:id', authenticateToken, articleController.editArticle);

    /**
     * @swagger
     * /articles/{id}:
     *  delete:
     *   summary: Use to delete one article by id
     *   parameters:
     *     - in: path
     *       name: id
     *       description: Id of article.
     *       required: true
     *   responses:
     *     '200':
     *        description: A successful response
     */
    app.delete('/articles/:id', authenticateToken, articleController.deleteArticle);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
}

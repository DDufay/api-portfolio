const ProjectCollection = require('../collection/Project');

/**
 * Allow us to get all projects.
 * @param {*} request 
 * @param {*} reply 
 */
getProjects = async (request, reply) => {
    await ProjectCollection.find(null, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
};

/**
 * Allow us to get project by ID.
 * @param {*} request 
 * @param {*} reply 
 */
getProject = async (request, reply) => {
    await ProjectCollection.findOne({ _id: request.params.project }, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
}

/**
 * Allow us to add a project.
 * @param {*} request 
 * @param {*} reply 
 */
addProjects = async (request, reply) => {
    const newProject = await new ProjectCollection(request.body).save();
    
    reply.send(newProject);
}

/**
 * Allow us to edit a project by ID.
 * @param {*} request 
 * @param {*} reply 
 */
editProjects = async (request, reply) => {
    await ProjectCollection.findByIdAndUpdate(request.params.project, request.body, {new: true}, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
}

/**
 * Allow us to delete a project by id.
 * @param {*} request 
 * @param {*} reply 
 */
deleteProject = async (request, reply) => {
    await ProjectCollection.deleteOne({ _id: request.params.project }, (error, result) => {
        if (error) {
            reply.send(error);
        } else {
            reply.send(result);
        }
    });
}

module.exports = {  getProjects, getProject, addProjects, editProjects, deleteProject };

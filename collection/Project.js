const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: String,
    description: String,
    date: String,
    technologies: String,
    picture: String,
    detailPicture: String,
    details: Array,
    github: String,
    site: String,
});

const ProjectCollection = mongoose.model('project', projectSchema);

module.exports = ProjectCollection;

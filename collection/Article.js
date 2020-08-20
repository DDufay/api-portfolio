const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const domPurify = createDomPurify(new JSDOM().window);

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
});

// trigged every time we POST/PUT an aritcle.
articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.description) {
        this.sanitizedHtml = domPurify.sanitize(marked(this.description));
    }

    next();
});

const ArticleCollection = mongoose.model('article', articleSchema);

module.exports = ArticleCollection;
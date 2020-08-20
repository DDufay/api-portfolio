const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe } = require("mocha");

const { expect } = chai;
chai.use(chaiHttp);

// Fake Article for tests.
const article = {
  "title": "Portfolio v5",
  "description": "<h3 id=\"stack\">Stack</h3>\n"
};

const editedArticle = {
  "title": "Test mocha/chai",
}

describe("Check Portfolio Api - Article", () => {
  it("It should POST an article", done => {
    chai
      .request(app)
      .post("/articles")
      .send(article)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-Type');
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        article.id = res.body._id;

        done();
      });
  });
  it("It should GET All articles", done => {
    chai
      .request(app)
      .get("/articles")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-Type');
        expect(res.body).to.be.a('array');
        expect(res.body[0]).to.have.property('title');
        expect(res.body[0]).to.have.property('description');
        expect(res.body[0]).to.have.property('slug');
        expect(res.body[0]).to.have.property('createdAt');
        expect(res.body[0]).to.have.property('sanitizedHtml');
        done();
      });
  });

  // it("It should GET One project", done => {
  //   chai
  //     .request(app)
  //     .get(`/projects/${project.id}`)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res).to.have.header('Content-Type');
  //       expect(res.body).to.be.a('object');
  //       expect(res.body).to.have.property('title');
  //       expect(res.body).to.have.property('description');
  //       expect(res.body).to.have.property('date');
  //       expect(res.body).to.have.property('technologies');
  //       expect(res.body).to.have.property('picture');
  //       expect(res.body).to.have.property('detailPicture');
  //       expect(res.body).to.have.property('details');
  //       expect(res.body).to.have.property('github');
  //       expect(res.body).to.have.property('site');
  //       done();
  //     });
  // });

  it("It should PUT an article", done => {
    chai
    .request(app)
    .put(`/articles/${article.id}`)
    .send(editedArticle)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res).to.have.status(200);
      expect(res).to.have.header('Content-Type');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('title');
      expect(res.body).to.have.property('description');

      expect(res.body.title).to.include(editedArticle.title);

      done();
    });
  });

  it("It should DELETE an article", done => {
    chai
    .request(app)
    .delete(`/articles/${article.id}`)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res).to.have.status(200);
      expect(res).to.have.header('Content-Type');

      done();
    });
  });
});

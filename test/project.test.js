const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { describe } = require("mocha");

const { expect } = chai;
chai.use(chaiHttp);

// Fake Project for tests.
const project = {
  "title": "Portfolio v5",
  "description": "Ce site est une présentation des projets que je réalises depuis que je travail dans le développement web/ mobile. Je met à jour régulièrement ce site, cherchant à le rendre à chaque fois meilleur.",
  "date": "Novembre 2015 - aujourd\"hui",
  "technologies": "ReactJS",
  "picture": "portfolio.png",
  "detailPicture": "portfolio-detail.png",
  "github": "test",
  "site": "test"
};

const editedProject = {
  "title": "Test mocha/chai",
}

describe("Check Portfolio Api - Project", () => {
  it("It should POST a project", done => {
    chai
      .request(app)
      .post("/projects")
      .send(project)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-Type');
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('date');
        expect(res.body).to.have.property('technologies');
        expect(res.body).to.have.property('picture');
        expect(res.body).to.have.property('detailPicture');
        expect(res.body).to.have.property('details');
        expect(res.body).to.have.property('github');
        expect(res.body).to.have.property('site');
        project.id = res.body._id;

        done();
      });
  });
  it("It should GET All projects", done => {
    chai
      .request(app)
      .get("/projects")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-Type');
        expect(res.body).to.be.a('array');
        expect(res.body[0]).to.have.property('title');
        expect(res.body[0]).to.have.property('description');
        expect(res.body[0]).to.have.property('date');
        expect(res.body[0]).to.have.property('technologies');
        expect(res.body[0]).to.have.property('picture');
        expect(res.body[0]).to.have.property('detailPicture');
        expect(res.body[0]).to.have.property('details');
        expect(res.body[0]).to.have.property('github');
        expect(res.body[0]).to.have.property('site');
        done();
      });
  });

  it("It should GET One project", done => {
    chai
      .request(app)
      .get(`/projects/${project.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.have.header('Content-Type');
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('description');
        expect(res.body).to.have.property('date');
        expect(res.body).to.have.property('technologies');
        expect(res.body).to.have.property('picture');
        expect(res.body).to.have.property('detailPicture');
        expect(res.body).to.have.property('details');
        expect(res.body).to.have.property('github');
        expect(res.body).to.have.property('site');
        done();
      });
  });

  it("It should PUT a project", done => {
    chai
    .request(app)
    .put(`/projects/${project.id}`)
    .send(editedProject)
    .end((err, res) => {
      if (err) {
        done(err);
      }
      expect(res).to.have.status(200);
      expect(res).to.have.header('Content-Type');
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('title');
      expect(res.body).to.have.property('description');
      expect(res.body).to.have.property('date');
      expect(res.body).to.have.property('technologies');
      expect(res.body).to.have.property('picture');
      expect(res.body).to.have.property('detailPicture');
      expect(res.body).to.have.property('details');
      expect(res.body).to.have.property('github');
      expect(res.body).to.have.property('site');


      expect(res.body.title).to.include(editedProject.title);

      done();
    });
  });

  it("It should DELETE a project", done => {
    chai
    .request(app)
    .delete(`/projects/${project.id}`)
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

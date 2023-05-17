const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js')


chai.use(chaiHttp);
const expect = chai.expect;

const newUsername = 'asddashjrtrf'
const newEmail = 'gifwefife@ijfdeij.com'
const newPassword = 'jdfjkn2312!!J'

describe('Testing routes', function() {
    this.timeout(5000);
    it("POST /user/register Checks if username is taken", function(done) {
        chai
            .request(app)
            .post('/user/register')
            .send({username: 'Hello5', email: 'Hello5@gmail.com', password: 'Hello444!'})
            .end((err, res) => {
                expect(err).to.exist;
                expect(err.response.body).to.deep.equal({
                    error: "Database Error. Username Invalid.",
                  });
                
                
            })
            done()
            
    })

    it("POST /user/register sending a new user", function(done) {
        chai
            .request(app)
            .post('/user/register')
            .send({username: newUsername, email: newEmail, password: newPassword})
            .end((err, res) => {
                
                expect(err).to.not.exist;
                expect(res).to.redirect;
                
                
            })
            done()
    })

    it("POST /user/secureLogin trying to login with a non existing user", (done) => {
        chai
            .request(app)
            .post('/user/secureLogin')
            .send({username: 'a', password: 'a'})
            .end((err, res) => {
                expect(err).to.exist;
                expect(err.response.body).to.deep.equal({
                    error: "Login Invalid!",
                  });
                
            })
            done()
            
    })
    it("POST /user/secureLogin trying to login with a existing user", (done) => {
        chai
            .request(app)
            .post('/user/secureLogin')
            .send({username: 'Hello5', password: 'Hello444!'})
            .end((err, res) => {
                
                expect().to.exist;
                expect(res).to.redirect;
                
            })
            done()
    })
})

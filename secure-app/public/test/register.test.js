const register = require('../register.js')
const assert = require('assert');

describe('Testing email checks', function() {
    it("Testing email no '@'", () => {
        const outcome = register.checkEmail("EmailTest.com")
        assert.equal(outcome, 0)
    })
    it("Testing email no .com", () => {
        const outcome = register.checkEmail("Email@test")
        assert.equal(outcome, 0)
    })
    it("Testing email correct", () => {
        const outcome = register.checkEmail("Email@Test.com")
        assert.equal(outcome, 1)
    })
});

describe('Testing username checks', function() {
    it("Testing only alpha numeric characters", () => {
        const outcome = register.checkUsername("y3423udhUDA7")
        assert.equal(outcome, 1)
    })
    it("Testing special characters", () => {
        const outcome = register.checkUsername("&^$*#@&^$@dh7")
        assert.equal(outcome, 0)
    })
});

describe('Testing password checks', function() {
    it("Testing correct password( At least 8 characters long, one uppercase, one lowercase, one number, and one special", () => {
        const outcome = register.checkPassword("Hello92!")
        assert.equal(outcome, 1)
    })
    it("Now in another order", () => {
        const outcome = register.checkPassword("&ur5Rjdi")
        assert.equal(outcome, 1)
    })
    it("Password too short", () => {
        const outcome = register.checkPassword("!uU5")
        assert.equal(outcome, 0)
    })
    it("Testing no number", () => {
        const outcome = register.checkPassword("iuhHUIHIU!")
        assert.equal(outcome, 0)
    })
    it("Testing no lowercase character", () => {
        const outcome = register.checkPassword("UEUIJI$26")
        assert.equal(outcome, 0)
    })
    it("Testing no uppercase character", () => {
        const outcome = register.checkPassword("dshj672$")
        assert.equal(outcome, 0)
    })
    it("Testing no special character", () => {
        const outcome = register.checkPassword("huduhHUS6")
        assert.equal(outcome, 0)
    })
});
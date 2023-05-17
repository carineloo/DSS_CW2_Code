const doubleCookies = require('../doubleCookies.js')
const assert = require('assert');

describe('Testing email checks', function() {
    it("Testing email no '@'", () => {
        const outcome = doubleCookies.checkEmail("EmailTest.com")
        assert.equal(outcome, 0)
    })
    it("Testing email no .com", () => {
        const outcome = doubleCookies.checkEmail("Email@test")
        assert.equal(outcome, 0)
    })
    it("Testing email correct", () => {
        const outcome = doubleCookies.checkEmail("Email@Test.com")
        assert.equal(outcome, 1)
    })
});

describe('Testing username checks', function() {
    it("Testing only alphanumeric characters", () => {
        const outcome = doubleCookies.checkUsername("y3423udhUDA7")
        assert.equal(outcome, 1)
    })
    it("Testing special characters", () => {
        const outcome = doubleCookies.checkUsername("&^$*#@&^$@dh7")
        assert.equal(outcome, 0)
    })
});

describe('Testing password checks', function() {
    it("Testing correct password( At least 8 characters long, one uppercase, one lowercase, one number, and one special", () => {
        const outcome = doubleCookies.checkPassword("Hello92!")
        assert.equal(outcome, 1)
    })
    it("Now in another order", () => {
        const outcome = doubleCookies.checkPassword("&ur5Rjdi")
        assert.equal(outcome, 1)
    })
    it("Password too short", () => {
        const outcome = doubleCookies.checkPassword("!uU5")
        assert.equal(outcome, 0)
    })
    it("Testing no number", () => {
        const outcome = doubleCookies.checkPassword("iuUIHIU!")
        assert.equal(outcome, 0)
    })
    it("Testing no lowercase character", () => {
        const outcome = doubleCookies.checkPassword("UEUIJI$26")
        assert.equal(outcome, 0)
    })
    it("Testing no uppercase character", () => {
        const outcome = doubleCookies.checkPassword("dshj672$")
        assert.equal(outcome, 0)
    })
    it("Testing no special character", () => {
        const outcome = doubleCookies.checkPassword("huduhHUS6")
        assert.equal(outcome, 0)
    })
});

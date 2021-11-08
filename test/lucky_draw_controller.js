const LuckyDrawController = artifacts.require("LuckyDrawController");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LuckyDrawController", function (/* accounts */) {
  it("should assert true", async function () {
    await LuckyDrawController.deployed();
    return assert.isTrue(true);
  });
});

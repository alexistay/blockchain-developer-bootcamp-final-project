const LuckyDrawController = artifacts.require("LuckyDrawController");
const { assert } = require('chai');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LuckyDrawController", function(accounts) {
  before(async() => {
    luckyDrawControllerInstance = await LuckyDrawController.deployed();
  })

  it("0 lucky draws on start", async ()=> {
    const numLuckyDraw = await luckyDrawControllerInstance.getNumluckyDraws();
    assert.equal(numLuckyDraw, 0, "No lucky draws at start");
  });

  describe("Running and Pause functionality", () => {
    it("is running when created", async () => {
      const controllerState = await luckyDrawControllerInstance.controllerState();
      assert.equal(controllerState, 0, "initial state should be running" )
    })  
  
    it("is paused when paused", async () => {
      await luckyDrawControllerInstance.setState(1);
      const controllerState = await luckyDrawControllerInstance.controllerState();
      assert.equal(controllerState, 1, "paused after setState(1)" )
    })

    it("should not allow luckyDraw creation when pause", async() => {
      try{
        await luckyDrawControllerInstance.setState(1);
        await luckyDrawControllerInstance.createluckyDraw();
      } catch(err) {
        assert.equal(err.reason, "Not running");
        await luckyDrawControllerInstance.setState(0);
      }
    })

    it("should not allow non owners to pause", async ()=> {
      try {
        await luckyDrawControllerInstance.setState(1, {from: accounts[1]});
      } catch(err) {
        assert.equal(err.reason, "Ownable: caller is not the owner");
      }
    })
  })
  
  
  describe("Lucky draw functionality", ()=> {
    it("should have 0 and 1 as first and second lucky draw id", async ()=>{
      let result = await luckyDrawControllerInstance.createluckyDraw();
      assert.equal(result.logs[0].args.contractId, 0, "First lucky draw ID should be 0");
      result = await luckyDrawControllerInstance.createluckyDraw();
      assert.equal(result.logs[0].args.contractId, 1, "Second lucky draw ID should be 1" );      
    })

    describe("Set entries", ()=>{     
      it("should be able to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        let luckyDraw = await luckyDrawControllerInstance.getLuckyDraw(luckyDrawId);
        assert.equal(luckyDraw[1], entries, "Entries should be set");
        assert.equal(luckyDraw.entriesURL, "ENTRYURL", "Entries URL should be set");
        assert.equal(luckyDraw.numEntries, 100, "Number of entries should be set");
        assert.equal(luckyDraw.luckyDrawState, 1, "Lucky draw state should be entriesSet");
      })

      it("should not allow other owner to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100, {from: accounts[1]});
        } catch(err) {
          assert.equal(err.reason, "Not owner");
        }
      })

      it("should not allow set entries when state is EntriesSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      it("should not allow set entries when state is WinnersSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      it("should not allow set entries when state is SeedSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSeed(luckyDrawId, "seed");
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })
    })
  
    describe("Pick winners", ()=> {

    
      it("should be able to pick winners", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        winner0 = winners[0];
        winner1 = winners[1]; 
        assert.isNotEmpty(winner0, "Winner 0 should not be empty");
        assert.isNotEmpty(winner1, "Winner 1 should not be empty");
      })

      it("should not allow pick winner when state is created", async()=> {
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be Created");
        }
      })

      it("should not allow pick winner when state is SeedSet", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSeed(luckyDrawId, "seed");
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be SeedSet");
        }
      })
    })

    describe("Set seed", ()=> {
      it("should not allow set seed when state is created", async()=>{
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        try {
          await luckyDrawControllerInstance.setSeed(luckyDrawId, "seed");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })

      it("should not allow set seed when state is EntriesSet", async()=>{
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createluckyDraw();
        let luckyDrawId = result.logs[0].args.contractId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        try {
          await luckyDrawControllerInstance.setSeed(luckyDrawId, "seed");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })
    })
  })
  
});

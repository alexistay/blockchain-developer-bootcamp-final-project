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

  describe("Pause functionality", () => {
    it("is unpaused when created", async () => {
      const paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, false, "should not be paused when created" )
    })  
  
    it("is paused when paused, unpaused when unpaused", async () => {
      await luckyDrawControllerInstance.pause();
      let paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, true, "should be paused after pausing" )
      await luckyDrawControllerInstance.unpause();
      paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, false, "should be paused after pausing" )
    })

    it("should not allow non owners to pause", async ()=> {
      try {
        await luckyDrawControllerInstance.pause({from: accounts[1]});
      } catch(err) {
        assert.equal(err.reason, "Ownable: caller is not the owner");
      }
    })
  })
  
  describe("Lucky draw functionality", ()=> {
    describe("Create lucky draws", ()=> {

      it("should have 0 and 1 as first and second lucky draw id", async ()=>{
        let result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw 1");
        assert.equal(result.logs[0].args.luckyDrawId, 0, "First lucky draw ID should be 0");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw 2");
        assert.equal(result.logs[0].args.luckyDrawId, 1, "Second lucky draw ID should be 1" );      
      })

      it("should return lucky draw ids created by user", async()=> {
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw A", {from: accounts[3]});
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw B", );
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw C", {from: accounts[3]});
        const luckyDrawIds = await luckyDrawControllerInstance.getLuckyDrawIds({from: accounts[3]});
        assert.equal(luckyDrawIds[0], 2, "First lucky draw ID should be 2");
        assert.equal(luckyDrawIds[1], 4, "Second lucky draw ID should be 4");  
      })

      it("should not allow luckyDraw creation when paused", async() => {
        try{
          await luckyDrawControllerInstance.pause();
          await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          await luckyDrawControllerInstance.unpause();
        }
      })

    })

    describe("Set entries", ()=>{     
      it("should be able to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        let luckyDraw = await luckyDrawControllerInstance.getLuckyDraw(luckyDrawId);
        assert.equal(luckyDraw[2], entries, "Entries should be set");
        assert.equal(luckyDraw.entriesURL, "ENTRYURL", "Entries URL should be set");
        assert.equal(luckyDraw.numEntries, 100, "Number of entries should be set");
        assert.equal(luckyDraw.luckyDrawState, 1, "Lucky draw state should be entriesSet");
      })

      it("should not allow other owner to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100, {from: accounts[1]});
        } catch(err) {
          assert.equal(err.reason, "Not owner");
        }
      })

      it("should not allow set entries when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.pause();
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          await luckyDrawControllerInstance.unpause();
        }
      })

      it("should not allow set entries when state is EntriesSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      it("should not allow set entries when state is WinnersSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      it("should not allow set entries when state is SaltSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
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
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        winner0 = winners[0];
        winner1 = winners[1]; 
        assert.isNotEmpty(winner0, "Winner 0 should not be empty");
        assert.isNotEmpty(winner1, "Winner 1 should not be empty");
      })

      it("should not allow pick winners when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        await luckyDrawControllerInstance.pause();
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          await luckyDrawControllerInstance.unpause();
        }
      })


      it("should not allow pick winner when state is created", async()=> {
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be Created");
        }
      })

      it("should not allow pick winner when state is SaltSet", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be SaltSet");
        }
      })
    })

    describe("Set salt", ()=> {
      it("should be able to set salt", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        let luckyDraw = await luckyDrawControllerInstance.getLuckyDraw(luckyDrawId);
        assert.equal(luckyDraw.salt, "salt", "Salt should be salt");
      })

      it("should not allow set salt when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        await luckyDrawControllerInstance.pause();
        try {
          await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          luckyDrawControllerInstance.unpause();
        }
      })

      it("should not allow set salt when state is created", async()=>{
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })

      it("should not allow set salt when state is EntriesSet", async()=>{
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "ENTRYURL", 100);
        try {
          await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })
    })
  })
  
});

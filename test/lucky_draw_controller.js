const LuckyDrawController = artifacts.require("LuckyDrawController");
const { assert } = require('chai');


contract("LuckyDrawController", function(accounts) {
  before(async() => {
    luckyDrawControllerInstance = await LuckyDrawController.deployed();
  })

  // Check that there are no lucky draws when contract is deployed
  it("0 lucky draws on start", async ()=> {
    const numLuckyDraw = await luckyDrawControllerInstance.getNumluckyDraws();
    assert.equal(numLuckyDraw, 0, "No lucky draws at start");
  });

  // Test the pause and unpause functionality
  describe("Pause functionality", () => {

    // Check that the contract is not paused at start
    it("is unpaused when created", async () => {
      const paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, false, "should not be paused when created" )
    })  
  
    // Check that the contract is paused after calling pause, and unpaused after calling unpause
    it("is paused when paused, unpaused when unpaused", async () => {
      await luckyDrawControllerInstance.pause();
      let paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, true, "should be paused after pausing" )
      await luckyDrawControllerInstance.unpause();
      paused = await luckyDrawControllerInstance.paused();
      assert.equal(paused, false, "should be paused after pausing" )
    })

    // Check that non owners are not allowed to pause the contract
    it("should not allow non owners to pause", async ()=> {
      try {
        await luckyDrawControllerInstance.pause({from: accounts[1]});
      } catch(err) {
        assert.equal(err.reason, "Ownable: caller is not the owner");
      }
    })
  })
  
  // Test the different lucky draw functionality
  describe("Lucky draw functionality", ()=> {

    // Test the lucky draw creation functionality
    describe("Create lucky draws", ()=> {

      // Check that the first and second lucky draw Ids are 0 and 1
      it("should have 0 and 1 as first and second lucky draw id", async ()=>{
        let result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw 1");
        assert.equal(result.logs[0].args.luckyDrawId, 0, "First lucky draw ID should be 0");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw 2");
        assert.equal(result.logs[0].args.luckyDrawId, 1, "Second lucky draw ID should be 1" );      
      })

      // Check that only the lucky draws created by a user are returned
      it("should return lucky draw ids created by user", async()=> {
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw A", {from: accounts[3]});
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw B", );
        await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw C", {from: accounts[3]});
        const luckyDrawIds = await luckyDrawControllerInstance.getLuckyDrawIds({from: accounts[3]});
        assert.equal(luckyDrawIds[0], 2, "First lucky draw ID should be 2");
        assert.equal(luckyDrawIds[1], 4, "Second lucky draw ID should be 4");  
      })
 
      // Check that lucky draw creation is not allowed when contract is paused
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

    // Test the lucky draw set entries functionality
    describe("Set entries", ()=>{     

      // Check that the entries are set correctly
      it("should be able to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        let luckyDraw = await luckyDrawControllerInstance.getLuckyDraw(luckyDrawId);
        assert.equal(luckyDraw[2], entries, "Entries should be set");
        assert.equal(luckyDraw.entriesIPFScid, "IPFScid", "IPFScid should be set");
        assert.equal(luckyDraw.numEntries, 100, "Number of entries should be set");
        assert.equal(luckyDraw.luckyDrawState, 1, "Lucky draw state should be entriesSet");
      })

      // Check that the non owners of the lucky draw are not allowed to set entries 
      it("should not allow other owner to set entries", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100, {from: accounts[1]});
        } catch(err) {
          assert.equal(err.reason, "Not owner");
        }
      })

      // Check that the entries cannot be set when contract is paused
      it("should not allow set entries when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.pause();
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          await luckyDrawControllerInstance.unpause();
        }
      })

      // Check that the entries cannot be set again when the entries have already been set
      // i.e. Operator is not allowed to change the entries once set.
      it("should not allow set entries when state is EntriesSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      // Check that the entries cannot be set when winners have already been picked
      // i.e. Operator is not allowed to change the entries once set.
      it("should not allow set entries when state is WinnersSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })

      // Check that the entries cannot be set when the lucky draw salt has already been entered
      // i.e. Operator is not allowed to change the entries once set.
      it("should not allow set entries when state is SaltSet (state not Created)", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        try {
          await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        } catch(err) {
          assert.equal(err.reason, "State not Created");
        }
      })
    })
  
    // Test the lucky draw pick winners functionality
    describe("Pick winners", ()=> {

      // Check that the lucky draw can pick winners
      it("should be able to pick winners", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        winner0 = winners[0];
        winner1 = winners[1]; 
        assert.isNotEmpty(winner0, "Winner 0 should not be empty");
        assert.isNotEmpty(winner1, "Winner 1 should not be empty");
      })

      // Check that pick winners cannot be called when the lucky draw is paused
      it("should not allow pick winners when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        await luckyDrawControllerInstance.pause();
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "Pausable: paused");
          await luckyDrawControllerInstance.unpause();
        }
      })

      // Check that pick winners is not allowed when the lucky draw is in the created state
      // i.e. the entries have not been set
      it("should not allow pick winner when state is created", async()=> {
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be Created");
        }
      })

      // Check that pick winners is not allowed when the salt has been set.
      // Using the commit reveal scheme, once the salt has been set, 
      // the lucky draw is in the reveal stage and should not allow winners to be picked anymore.
      it("should not allow pick winner when state is SaltSet", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        try {
          await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        } catch(err) {
          assert.equal(err.reason, "State cannot be SaltSet");
        }
      })
    })

    // Test the lucky draw set salt functionality
    describe("Set salt", ()=> {

      // Check that the lucky draw can set the salt
      it("should be able to set salt", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        let winners = await luckyDrawControllerInstance.getWinners(luckyDrawId);
        await luckyDrawControllerInstance.pickWinner(luckyDrawId);
        await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        let luckyDraw = await luckyDrawControllerInstance.getLuckyDraw(luckyDrawId);
        assert.equal(luckyDraw.salt, "salt", "Salt should be salt");
      })

      // Check that the salt cannot be set when the lucky draw is paused
      it("should not allow set salt when paused", async()=> {
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
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

      // Check that the salt cannot be set when the lucky draw is in the created state
      // i.e. the entries have not been set
      it("should not allow set salt when state is created", async()=>{
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        try {
          await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })

      // Check that the salt cannot be set when the lucky draw is in the entries set state
      // i.e. the winners have not been picked
      it("should not allow set salt when state is EntriesSet", async()=>{
        let entries = web3.utils.sha3("Entry1\nEntry2");
        result = await luckyDrawControllerInstance.createLuckyDraw("Lucky Draw");
        let luckyDrawId = result.logs[0].args.luckyDrawId;
        await luckyDrawControllerInstance.setEntries(luckyDrawId, entries, "IPFScid", 100);
        try {
          await luckyDrawControllerInstance.setSalt(luckyDrawId, "salt");
        } catch(err) {
          assert.equal(err.reason, "State not WinnerSet");
        }
      })
    })
  })
  
});

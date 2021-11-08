// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LuckyDrawController is Ownable {
    enum ControllerState {
        Running,
        Paused
    }
    ControllerState public controllerState;

    function setState(ControllerState _controllerState) public onlyOwner returns (ControllerState) {
        controllerState = _controllerState;
        return controllerState;
    }

    modifier onlyRunning() {
        require (controllerState == ControllerState.Running, "Not running");
        _;
    }

    struct LuckyDraw {
        address owner;
        bytes32 entries;
        string entriesURL;
        uint256 numEntries;
        string seed;
        uint256[] winners;
        LuckyDrawState luckyDrawState;
    }

    enum LuckyDrawState {
        Created,
        EntriesSet,
        WinnerSet,
        SeedSet
    }
    
    LuckyDraw[] public luckyDraws;

    event LuckyDrawCreated(uint256 contractId);
    function createluckyDraw() public onlyRunning returns (uint256) {
        LuckyDraw memory luckyDraw;
        luckyDraw.owner = msg.sender;
        luckyDraws.push(luckyDraw);
        emit LuckyDrawCreated(luckyDraws.length-1);
        return luckyDraws.length -1;
    }    
    
    modifier onlyLuckyDrawOwner(uint256 _luckyDrawId) {
        require (msg.sender == luckyDraws[_luckyDrawId].owner, "Not owner");
        _;
    }
    
    function setEntries(uint256 _luckyDrawId, bytes32 _entries, string memory _entriesURL, uint256 _numEntries) 
            public onlyRunning() onlyLuckyDrawOwner(_luckyDrawId) {
        require(luckyDraws[_luckyDrawId].luckyDrawState == LuckyDrawState.Created, "State not Created");
        luckyDraws[_luckyDrawId].entries = _entries;
        luckyDraws[_luckyDrawId].entriesURL = _entriesURL;
        luckyDraws[_luckyDrawId].numEntries = _numEntries;

        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.EntriesSet;
    }
    
    function pickWinner(uint256 _luckyDrawId) public onlyLuckyDrawOwner(_luckyDrawId) returns (uint256 winner) {
        require(luckyDraws[_luckyDrawId].luckyDrawState != LuckyDrawState.Created, "State cannot be Created");
        require(luckyDraws[_luckyDrawId].luckyDrawState != LuckyDrawState.SeedSet, "State cannot be SeedSet");

        winner =  uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _luckyDrawId, luckyDraws[_luckyDrawId].winners.length))) % luckyDraws[_luckyDrawId].numEntries;
        luckyDraws[_luckyDrawId].winners.push(winner);

        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.WinnerSet;
    }

    function setSeed(uint256 _luckyDrawId, string memory _seed) public onlyLuckyDrawOwner(_luckyDrawId) {
        require(luckyDraws[_luckyDrawId].luckyDrawState == LuckyDrawState.WinnerSet, "State not WinnerSet");
        luckyDraws[_luckyDrawId].seed = _seed;
        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.SeedSet;
    }



    function getNumluckyDraws() public view returns (uint256) {
        return luckyDraws.length;
    }

    function getLuckyDraw(uint256 _luckyDrawId) public view returns (LuckyDraw memory luckyDraw) {
        luckyDraw = luckyDraws[_luckyDrawId];
    }
    
    function getEntries(uint256 _luckyDrawId) public view returns (bytes32 entries) {
        entries = luckyDraws[_luckyDrawId].entries;
    }
    
    function getWinners(uint256 _luckyDrawId) public view returns (uint256[] memory winners) {
        winners = luckyDraws[_luckyDrawId].winners;
    }
    
    
    
}

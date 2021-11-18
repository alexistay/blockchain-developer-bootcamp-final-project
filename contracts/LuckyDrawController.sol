// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";



contract LuckyDrawController is Ownable, Pausable {

      function pause() public onlyOwner returns (bool) {
        _pause();
        return paused();
    }

    function unpause() public onlyOwner returns (bool) {
        _unpause();
        return paused();
    }

    struct LuckyDraw {
        address owner;
        string name;
        bytes32 entries;
        string entriesURL;
        uint256 numEntries;
        string salt;
        uint256[] winners;
        LuckyDrawState luckyDrawState;
    }

    enum LuckyDrawState {
        Created,
        EntriesSet,
        WinnerSet,
        SaltSet
    }
    
    LuckyDraw[] public luckyDraws;

    event LuckyDrawCreated(uint256 luckyDrawId, LuckyDraw luckyDraw);
    event LuckyDrawEntriesSet(LuckyDraw luckyDraw);
    event LuckyDrawWinnerPicked(LuckyDraw luckyDraw);
    event LuckyDrawSaltSet(LuckyDraw luckyDraw);

    function createLuckyDraw(string memory _name) public whenNotPaused() {
        LuckyDraw memory luckyDraw;
        luckyDraw.owner = msg.sender;
        luckyDraw.name = _name;
        luckyDraws.push(luckyDraw);
        emit LuckyDrawCreated(luckyDraws.length-1, luckyDraw);
        
    }    
    
    modifier onlyLuckyDrawOwner(uint256 _luckyDrawId) {
        require (msg.sender == luckyDraws[_luckyDrawId].owner, "Not owner");
        _;
    }
    
    function setEntries(uint256 _luckyDrawId, bytes32 _entries, string memory _entriesURL, uint256 _numEntries) 
            public whenNotPaused() onlyLuckyDrawOwner(_luckyDrawId) {
        require(luckyDraws[_luckyDrawId].luckyDrawState == LuckyDrawState.Created, "State not Created");
        luckyDraws[_luckyDrawId].entries = _entries;
        luckyDraws[_luckyDrawId].entriesURL = _entriesURL;
        luckyDraws[_luckyDrawId].numEntries = _numEntries;

        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.EntriesSet;
        emit LuckyDrawEntriesSet(luckyDraws[_luckyDrawId]);
    }
    
    function pickWinner(uint256 _luckyDrawId) public whenNotPaused() onlyLuckyDrawOwner(_luckyDrawId) returns (uint256 winner) {
        require(luckyDraws[_luckyDrawId].luckyDrawState != LuckyDrawState.Created, "State cannot be Created");
        require(luckyDraws[_luckyDrawId].luckyDrawState != LuckyDrawState.SaltSet, "State cannot be SaltSet");

        winner =  uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _luckyDrawId, luckyDraws[_luckyDrawId].winners.length))) % luckyDraws[_luckyDrawId].numEntries;
        luckyDraws[_luckyDrawId].winners.push(winner);

        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.WinnerSet;
        emit LuckyDrawWinnerPicked(luckyDraws[_luckyDrawId]);
    }

    function setSalt(uint256 _luckyDrawId, string memory _salt) public whenNotPaused() onlyLuckyDrawOwner(_luckyDrawId) returns (LuckyDraw memory) {
        require(luckyDraws[_luckyDrawId].luckyDrawState == LuckyDrawState.WinnerSet, "State not WinnerSet");
        luckyDraws[_luckyDrawId].salt = _salt;
        luckyDraws[_luckyDrawId].luckyDrawState = LuckyDrawState.SaltSet;
        emit LuckyDrawSaltSet(luckyDraws[_luckyDrawId]);
    }

    function getNumluckyDraws() public view returns (uint256) {
        return luckyDraws.length;
    }

    function getLuckyDrawIds() public view returns (uint256[] memory  ) {
        uint256 length;
        length = 0;
        for (uint256 i = 0; i < luckyDraws.length; i++) {
            if (luckyDraws[i].owner == msg.sender) {
                length++;
            }
        }
        uint[] memory luckyDrawIds = new uint256[](length);
        length = 0;
        for (uint256 i = 0; i < luckyDraws.length; i++) {
            if (luckyDraws[i].owner == msg.sender) {
                luckyDrawIds[length] = i;
                length++;
            }
        }
        return luckyDrawIds;
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

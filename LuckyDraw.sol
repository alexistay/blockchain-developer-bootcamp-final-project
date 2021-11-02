pragma solidity ^0.8.3;

contract LuckyDraw {
    enum RandomType {
        BLOCK,
        CHAINLINK
    }
    
    struct Contest {
        address owner;
        RandomType randomType;
        bytes32 entries;
        string entriesURL;
        uint256 numEntries;
        uint256[] winners;
    }
    
    Contest[] public contests;

    function createContest(RandomType _randomType) public returns (uint256) {
        Contest memory contest;
        contest.owner = msg.sender;
        contest.randomType = _randomType;
        contests.push(contest);
        return contests.length;
    }    
    
    modifier onlyOwner(uint256 _contestId) {
        require (msg.sender == contests[_contestId].owner, "Not owner");
        _;
    }
    
    modifier entriesNotSet(uint256 _contestId) {
        require (contests[_contestId].entries != 0, "Entries set");
        _;
    }
    
    function setEntries(uint256 _contestId, bytes32 _entries, string memory _entriesURL, uint256 _numEntries) 
            public onlyOwner(_contestId) entriesNotSet(_contestId) {
        contests[_contestId].entries = _entries;
        contests[_contestId].entriesURL = _entriesURL;
        contests[_contestId].numEntries = _numEntries;
    }
    
    function getNumContests() public view returns (uint256) {
        return contests.length;
    }
    
    function getEntries(uint256 _contestId) public view returns (bytes32 entries) {
        entries = contests[_contestId].entries;
    }
    
    function getWinners(uint256 _contestId) public view returns (uint256[] memory winners) {
        winners = contests[_contestId].winners;
    }
    
    function pickWinner(uint256 _contestId) public onlyOwner(_contestId) returns (uint256 winner) {
        if (contests[_contestId].randomType == RandomType.BLOCK) {
            winner =  uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % contests[_contestId].numEntries;
            contests[_contestId].winners.push(winner);
        }
    }
}
